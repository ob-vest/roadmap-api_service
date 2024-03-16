import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { db } from "../../database/db-connect";
import { eq } from "drizzle-orm";
import * as schema from "../../database/schema";
import e from "express";

export async function generateCustomToken(appleUserId: string) {
  // Generate a custom token that expires after 1 week using the appleUserId
  console.log("Generating custom token for appleUserId:", appleUserId);

  const customToken = jwt.sign(
    {
      appleUserId: appleUserId,
    },
    process.env.authPrivateKey!,
    {
      algorithm: "ES256",
      expiresIn: "1m",
    }
  );
  return customToken;
}

export function generateClientSecret(clientID: string = process.env.clientID!) {
  const teamID = process.env.teamID!;
  const keyIdentifier = process.env.keyIdentifier!;
  const privateKey = process.env.authPrivateKey!;
  const clientSecret = jwt.sign(
    {
      iss: teamID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15777000,
      aud: "https://appleid.apple.com",
      sub: clientID,
    },
    privateKey,
    {
      algorithm: "ES256",
      keyid: keyIdentifier,
    }
  );
  return clientSecret;
}

export async function generateDisplayName() {
  let displayName: string = "";
  let isUnique = false;

  while (!isUnique) {
    displayName = `${faker.word.adjective({
      length: { min: 3, max: 7 },
    })} ${faker.animal.type()}`;

    const existingUsers = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.displayName, displayName));

    if (existingUsers.length === 0) {
      isUnique = true;
    } else {
      console.log("Display name already exists, generating a new one...");
    }
  }

  return displayName;
}
