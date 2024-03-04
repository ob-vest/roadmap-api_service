import express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// import appleSignin from "apple-signin-auth";

export const authRouter = express.Router();

async function key(kid: string) {
  const client = jwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
  });
  return await client.getSigningKey(kid);
}

// Callback URL for handling the Apple Login response
authRouter.post("/auth/apple/callback", async (req, res) => {
  const id_token = req.body.id_token as string;

  const kid = jwt.decode(id_token, {
    complete: true,
  })?.header.kid;

  console.log("id_token", id_token);
  try {
    const publicKey = (await key(kid!)).getPublicKey();
    console.log("publicKey", publicKey);
    // Verify the id_token
    const response = await fetch("https://appleid.apple.com/auth/keys");
    const applePublicKey = await response.json();
    console.log("applePublicKey", applePublicKey);

    const decoded = jwt.verify(id_token, publicKey, {
      algorithms: ["RS256"],
    });

    // Code to handle user authentication and retrieval using the decoded information
    console.log("decoded", decoded);
    res.status(200).send(decoded);
  } catch (error) {
    const err = error as Error;
    console.error("Error:", err.message);
    res.status(500).send(err.message);
  }
});

// Generate refresh token for the user
authRouter.post("/auth/apple/refresh", async (req, res) => {
  // Code to generate a new refresh token for the user
  const code = req.body.code as string;
  console.log("code", code);
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
  console.log("clientSecret", clientSecret);

  const response = await fetch(
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

  const data = await response.json();

  res.status(200).send(data);
});

// // const options = {
// //   clientID: process.env.clientID!, // Apple Client ID
// //   redirectUri: "http://localhost:3000/auth/apple/callback",
// //   // OPTIONAL
// //   state: "state", // optional, An unguessable random string. It is primarily used to protect against CSRF attacks.
// //   responseMode: "query", // Force set to form_post if scope includes 'email'
// //   //   scope: "email", // optional
// // };

// // const authorizationUrl = appleSignin.getAuthorizationUrl(options);
// authRouter.post("/auth/apple/callback", async (req, res) => {
//   const code = req.headers.code as string;
//   console.log("code", code);
//   const clientSecret = appleSignin.getClientSecret({
//     clientID: process.env.clientID!,
//     teamID: process.env.teamID!,
//     privateKey: process.env.authPrivateKey,
//     keyIdentifier: process.env.keyIdentifier!,
//     // OPTIONAL
//     expAfter: 15777000, // Unix time in seconds after which to expire the clientSecret JWT. Default is now+5 minutes.
//   });

//   const options = {
//     clientID: process.env.clientID!, // Apple Client ID

//     clientSecret: clientSecret,
//   };

//   try {
//     const tokenResponse = await appleSignin.getAuthorizationToken(
//       code,
//       options
//     );
//     console.log(tokenResponse);
//     res.send(tokenResponse);
//   } catch (err) {
//     console.error(err);
//   }
// });

// authRouter.post("/auth/apple/verify", async (req, res) => {
//   const idToken = req.headers.id_token as string;
//   console.log("idToken", idToken);
//   const clientSecret = appleSignin.getClientSecret({
//     clientID: process.env.clientID!,
//     teamID: process.env.teamID!,
//     privateKey: process.env.authPrivateKey,
//     keyIdentifier: process.env.keyIdentifier!,
//     // OPTIONAL
//     expAfter: 15777000, // Unix time in seconds after which to expire the clientSecret JWT. Default is now+5 minutes.
//   });
//   console.log("clientSecret:", clientSecret);
//   const options = {
//     clientID: process.env.clientID!, // Apple Client ID
//     clientSecret: clientSecret,
//   };

//   try {
//     const verifyResponse = await appleSignin.verifyIdToken(idToken, options);
//     console.log(verifyResponse);
//     res.send(verifyResponse);
//   } catch (err) {
//     console.error(err);
//   }
// });
