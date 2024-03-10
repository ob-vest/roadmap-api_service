import express from "express";
import { getRequests } from "../controllers/getRequests";
import { getCommentsByRequest } from "../controllers/getCommentsByRequest";
import { postComment } from "../controllers/postComment";
import { postRequest } from "../controllers/postRequest";
import { session } from "../controllers/auth/session";

export const requestsRouter = express.Router();

requestsRouter.get("/requests", getRequests);
requestsRouter.post("/requests", session, postRequest);

requestsRouter.get("/requests/:requestId/comments", getCommentsByRequest);
requestsRouter.post("/requests/:requestId/comments", postComment);
