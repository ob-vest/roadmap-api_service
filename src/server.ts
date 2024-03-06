import express from "express";
import { authRouter } from "./routes/apple-auth";
import { requestsRouter } from "./routes/requests";
import { db } from "./database/db-connect";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", requestsRouter);
db;

console.log("authPrivate", process.env.authPrivateKey);
app.use("/auth", authRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
