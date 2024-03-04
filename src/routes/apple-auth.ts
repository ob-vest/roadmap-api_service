import express from "express";
import appleSignin from "apple-signin-auth";

export const authRouter = express.Router();

// const options = {
//   clientID: process.env.clientID!, // Apple Client ID
//   redirectUri: "http://localhost:3000/auth/apple/callback",
//   // OPTIONAL
//   state: "state", // optional, An unguessable random string. It is primarily used to protect against CSRF attacks.
//   responseMode: "query", // Force set to form_post if scope includes 'email'
//   //   scope: "email", // optional
// };

// const authorizationUrl = appleSignin.getAuthorizationUrl(options);
authRouter.post("/auth/apple/callback", async (req, res) => {
  const code = req.headers.code as string;
  console.log("code", code);
  const clientSecret = appleSignin.getClientSecret({
    clientID: process.env.clientID!,
    teamID: process.env.teamID!,
    privateKey: process.env.authPrivateKey,
    keyIdentifier: process.env.keyIdentifier!,
    // OPTIONAL
    expAfter: 15777000, // Unix time in seconds after which to expire the clientSecret JWT. Default is now+5 minutes.
  });

  const options = {
    clientID: process.env.clientID!, // Apple Client ID
    redirectUri: "http://localhost:3000/auth/apple/callback", // use the same value which you passed to authorisation URL.
    clientSecret: clientSecret,
  };

  try {
    const tokenResponse = await appleSignin.getAuthorizationToken(
      code,
      options
    );
    console.log(tokenResponse);
    res.send(tokenResponse);
  } catch (err) {
    console.error(err);
  }
});
