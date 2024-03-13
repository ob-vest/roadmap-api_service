import { Request, Response } from "express";
import { db } from "../../database/db-connect";
import * as schema from "../../database/schema";
import { SQL, and, eq } from "drizzle-orm";

export const getRequestsADMIN = async (req: Request, res: Response) => {
  const stateId: number | null = Number(req.query.stateId);
  const typeId: number | null = Number(req.query.typeId);

  const where: SQL[] = [];
  if (stateId) {
    where.push(eq(schema.request.stateId, stateId));
  }
  if (typeId) {
    where.push(eq(schema.request.typeId, typeId));
  }
  let query = db
    .select({
      id: schema.request.id,
      title: schema.request.title,
      description: schema.request.description,
      stateId: schema.request.stateId,
      typeId: schema.request.typeId,
      createdAt: schema.request.createdAt,
      lastActivityAt: schema.request.lastActivityAt,
    })
    .from(schema.request)
    .where(and(...where));

  const requestResult = await query;
  console.log("requestResult", requestResult);
  res.send(requestResult);
};
