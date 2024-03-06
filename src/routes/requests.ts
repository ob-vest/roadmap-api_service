import express from "express";
import { getRequests } from "../controllers/getRequests";
import { getCommentsByRequest } from "../controllers/getCommentsByRequest";
import { postComment } from "../controllers/postComment";
export const requestsRouter = express.Router();

requestsRouter.get("/requests", getRequests);
requestsRouter.get("/requests/:requestId/comments", getCommentsByRequest);
requestsRouter.post("/requests/:requestId/comments", postComment);
