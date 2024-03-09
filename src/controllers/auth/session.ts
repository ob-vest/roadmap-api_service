import { Request, Response } from "express";
import { db } from "../../database/db-connect";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import * as schema from "../../database/schema";
import { NextFunction } from "express";
import {
  generateClientSecret,
  generateCustomToken,
} from "./authHelperFunctions";

// Middleware to check if the user is authenticated
export const session = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json("No authorization header provided");
    return;
  }

  const token = authorization.split(" ")[1];

  //   try {
  await getUserFromToken(token, res);

  next();
};

interface UserToken {
  appleUserId: string;
  exp: number;
}

async function getUserFromToken(token: string, sessionRes: Response) {
  const privateKey = process.env.authPrivateKey!;
  try {
    const decodedToken = jwt.verify(token, privateKey, {
      algorithms: ["ES256"],
    }) as UserToken;

    console.log("decodedToken", decodedToken);

    const user = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.appleUserId, decodedToken.appleUserId));

    if (!user) {
      throw new Error("User not found");
    }
    return user[0];
  } catch (err) {
    if (err instanceof JsonWebTokenError && err.message === "jwt expired") {
      const decodedToken = jwt.decode(token) as UserToken;

      await validateUsersRefreshToken(decodedToken.appleUserId, sessionRes);
    } else {
      // Handle other errors here
      console.error("An unexpected error occurred:", err);
      throw new Error("Unauthorized");
    }
  }
}

async function validateUsersRefreshToken(
  appleUserId: string,
  sessionRes: Response
) {
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
  //   console.log("User refresh token:", user[0].refreshToken);
  //   console.log("clientID:", process.env.clientID!);
  //   console.log("clientSecret:", generateClientSecret());

  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.clientID!,
      client_secret: generateClientSecret(),
      grant_type: "refresh_token",
      refresh_token: user[0].refreshToken,
    }),
  });
  if (!response.ok) {
    console.error("Error validating refresh token:", response.statusText);
    throw new Error("Unauthorized");
  }
  return sessionRes.header(
    "Authorization",
    await generateCustomToken(appleUserId)
  );
}
