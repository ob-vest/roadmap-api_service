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
  const user = await getUserFromToken(token, res);
  if (user) {
    res.locals.user = user;
    next();
  }
  console.log("END:", user);
};

interface UserToken {
  appleUserId: string;
  exp: number;
}

async function getUserFromToken(token: string, sessionRes: Response) {
  const privateKey = process.env.authPrivateKey!;
  try {
    const decodedToken = jwt.decode(token) as UserToken;

    const user = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.appleUserId, decodedToken.appleUserId));

    if (!user) {
      throw new Error("User not found");
    }

    if (decodedToken.exp < Date.now() / 1000) {
      await validateUsersRefreshToken(
        user[0].appleUserId,
        user[0].refreshToken,
        sessionRes
      );
    } else {
      console.log("Verifying token:", token);
      jwt.verify(token, privateKey, {
        algorithms: ["ES256"],
      }) as UserToken;
    }

    console.log("Returning user:", user[0]);
    return user[0];
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    sessionRes.status(401).json("Unauthorized");
  }
}

async function validateUsersRefreshToken(
  appleUserId: string,
  refreshToken: string,
  sessionRes: Response
) {
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
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok) {
    console.error("Error validating refresh token:", response.statusText);
    throw new Error("Unauthorized");
  }
  console.log("Refresh token validated successfully");
  sessionRes.setHeader("Authorization", await generateCustomToken(appleUserId));
  //   return sessionRes.header(
  //     "Authorization",
  //     await generateCustomToken(appleUserId)
  //   );
}
