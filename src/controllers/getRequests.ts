import { Request, Response } from "express";
import { db } from "../database/db-connect";

export const getRequests = async (req: Request, res: Response) => {
  const requests = await db.query.request.findMany();
  res.send(requests);
};
