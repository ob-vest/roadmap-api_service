import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";

export const getRequests = async (req: Request, res: Response) => {
  const requests = await db.query.request.findMany();
  res.send(requests);
};
