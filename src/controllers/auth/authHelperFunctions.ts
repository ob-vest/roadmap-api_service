import jwt from "jsonwebtoken";

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
