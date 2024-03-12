import express from "express";
import { getRequests } from "../controllers/getRequests";
import { getCommentsByRequest } from "../controllers/getCommentsByRequest";
import { postComment } from "../controllers/postComment";
import { postRequest } from "../controllers/postRequest";
import { postUpvote } from "../controllers/postUpvote";
import { session } from "../controllers/auth/session";

export const requestsRouter = express.Router();

requestsRouter.get("/requests", session(true), getRequests);
requestsRouter.post("/requests", session(), postRequest);

requestsRouter.get("/requests/:requestId/comments", getCommentsByRequest);
requestsRouter.post("/requests/:requestId/comments", session(), postComment);

requestsRouter.post("/requests/:requestId/upvote", session(), postUpvote);
