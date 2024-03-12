import express from "express";
import { login } from "../controllers/auth/login";
import { session } from "../controllers/auth/session";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/session", session);
