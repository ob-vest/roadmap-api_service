import express from "express";
import { getRequestsADMIN } from "../controllers/admin/getRequests";

export const adminRequestsRouter = express.Router();

adminRequestsRouter.get("/admin/requests", getRequestsADMIN);
