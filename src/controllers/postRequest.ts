import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";

export const postRequest = async (req: Request, res: Response) => {
  const { title, description, stateId, typeId } = req.body;

  if (!title || !description) {
    res.status(400).json("Invalid title or description");
    return;
  }
  // Check whether the Ids is valid

  const state = await db
    .select()
    .from(schema.requestState)
    .where(eq(schema.requestState.id, stateId));

  if (state.length === 0) {
    res.status(400).json("State not found");
    return;
  }
  const type = await db
    .select()
    .from(schema.requestType)
    .where(eq(schema.requestType.id, typeId));

  if (type.length === 0) {
    res.status(400).json("Type not found");
    return;
  }

  await db.insert(schema.request).values({
    userId: 1,
    stateId: stateId,
    typeId: typeId,
    title: title,
    description: description,
  });

  res.status(201).send();
};
