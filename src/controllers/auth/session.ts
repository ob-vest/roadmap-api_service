import { Request, Response } from "express";
import { db } from "../../database/db-connect";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import * as schema from "../../database/schema";
import { NextFunction } from "express";
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
  // Verify the JWT token
  // Decode and verify the token
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
      !decodedToken.appleUserId
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
      throw new Error("Unauthorized");
    }
  }
}
