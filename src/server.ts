import express from "express";
import { authRouter } from "./routes/apple-auth";
import { requestsRouter } from "./routes/requests";
import { db } from "./database/db-connect";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", requestsRouter);
app.use("/api/auth", authRouter);

db;

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening at port:${port}`);
});
