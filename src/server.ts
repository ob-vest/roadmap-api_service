import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { authRouter } from "./routes/apple-auth";

const app = express();
console.log("authPrivate", process.env.authPrivateKey);
app.use("/", authRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
