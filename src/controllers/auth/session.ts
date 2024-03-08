import { Request, Response } from "express";
import { db } from "../../database/db-connect";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import * as schema from "../../database/schema";
import { NextFunction } from "express";

// Middleware to check if the user is authenticated
export const session = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json("Unauthorized");
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    await getUserFromToken(token);

    next();
  } catch (err) {
    // Handle other errors here
    console.error("An unexpected error occurred:", err);
    res.status(400).json("Unauthorized");
  }
};

async function getUserFromToken(token: string) {
  const privateKey = process.env.authPrivateKey!;
  try {
    const decodedToken = jwt.verify(token, privateKey, {
      algorithms: ["ES256"],
    });

    if (
      !decodedToken ||
      typeof decodedToken === "string" ||
      !decodedToken.appleUserId ||
      !decodedToken.exp
    ) {
      throw new Error("Unauthorized");
    }

    const user = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.appleUserId, decodedToken.appleUserId));

    if (!user) {
      throw new Error("Unauthorized");
    }
    return user[0];
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      // Handle the JWT error here
      console.error("JWT verification failed:", err.message);
      if (err.message === "jwt expired") {
        const decodedToken = jwt.decode(token);

        if (
          decodedToken !== null &&
          typeof decodedToken !== "string" &&
          decodedToken.appleUserId !== null
        ) {
          validateUsersRefreshToken(decodedToken.appleUserId);
        }
      }
      throw new Error("Unauthorized");
    }
  }
}

async function validateUsersRefreshToken(appleUserId: string) {
  console.log("Validating refresh token for user:", appleUserId);
  const user = await db
    .select({
      refreshToken: schema.user.refreshToken,
    })
    .from(schema.user)
    .where(eq(schema.user.appleUserId, appleUserId));

  if (!user[0]) {
    console.error("User not found");
    throw new Error("Unauthorized");
  }
  console.log("User found:", user[0]);
  console.log("User refresh token:", user[0].refreshToken);
  console.log("clientID:", process.env.clientID!);
  console.log("clientSecret:", process.env.clientSecret!);

  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.clientID!,
      client_secret: process.env.clientSecret!,
      grant_type: "refresh_token",
      refresh_token: user[0].refreshToken,
    }),
  });
  if (!response.ok) {
    console.error("Error validating refresh token:", response.statusText);
    throw new Error("Unauthorized");
  }
}
