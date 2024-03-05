import express from "express";
import { getRequests } from "../controllers/getRequests";

export const requestsRouter = express.Router();

requestsRouter.get("/requests", getRequests);
