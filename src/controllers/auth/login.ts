import { Request, Response } from "express";
import { db } from "../../database/db-connect";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient, { DecodedToken } from "jwks-rsa";
import * as model from "../../models/authentication";
import * as schema from "../../database/schema";
import { eq } from "drizzle-orm";

export const getRequests = async (req: Request, res: Response) => {
  // Code to handle user login

  const { code } = req.body;

  if (!code) {
    res.status(400).json("Invalid code");
    return;
  }

  console.log("code", code);
  const clientID = process.env.clientID!;
  const clientSecret = generateClientSecret();

  console.log("clientSecret", clientSecret);

  const appleTokenResponse = await fetch(
    "https://appleid.apple.com/auth/oauth2/v2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientID,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
      }),
    }
  );

  if (!appleTokenResponse.ok) {
    res.status(400).json("You are not authorized to access this resource.");
    return;
  }
  const appleTokenResponseData =
    (await appleTokenResponse.json()) as model.IAppleSignInResponse;

  console.log("appleTokenResponseData", appleTokenResponseData);
  const appleUserId = await decodeAppleIdToken(appleTokenResponseData.id_token);

  let user = await findUserInDatabase(appleUserId);

  if (user.length === 0) {
    await createUserInDatabase(
      appleUserId,
      appleTokenResponseData.refresh_token
    );
    user = await findUserInDatabase(appleUserId);
  }

  const response = {
    appleUserId: user[0].appleUserId,
    authorization: await generateCustomToken(user[0].appleUserId),
  };

  res.status(200).json(response);
};

// -------------------------------
// Helper functions
// -------------------------------

async function findUserInDatabase(appleUserId: string) {
  const user = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.appleUserId, appleUserId));
  return user;
}

async function createUserInDatabase(appleUserId: string, refreshToken: string) {
  await db.insert(schema.user).values({
    appleUserId: appleUserId,
    refreshToken: refreshToken,
  });
}

async function decodeAppleIdToken(idToken: string) {
  const client = jwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
  });

  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded) {
    throw new Error("Invalid token");
  }
  const kid = decoded.header.kid;
  const key = await client.getSigningKey(kid);
  const publicKey = key.getPublicKey();
  const decodedToken: JwtPayload | string = jwt.verify(idToken, publicKey, {
    algorithms: ["RS256"],
  });
  if (typeof decodedToken === "string" || !decodedToken.sub) {
    throw new Error("Invalid token");
  }
  return decodedToken.sub;
}

function generateClientSecret() {
  const clientID = process.env.clientID!;
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
async function generateCustomToken(appleUserId: string) {
  // Generate a custom token that expires after 1 week using the appleUserId
  const customToken = jwt.sign(
    {
      appleUserId: appleUserId,
    },
    process.env.authPrivateKey!,
    {
      algorithm: "ES256",
      expiresIn: "1w",
    }
  );
  return customToken;
}
