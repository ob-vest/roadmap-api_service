import express from "express";
import { authRouter } from "./routes/apple-auth";
import { db } from "./database/db-connect";

const app = express();
db;
app.use(express.urlencoded({ extended: true }));

console.log("authPrivate", process.env.authPrivateKey);
app.use("/auth", authRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
