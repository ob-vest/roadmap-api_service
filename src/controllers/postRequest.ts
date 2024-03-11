import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";

export const postRequest = async (req: Request, res: Response) => {
  const { title, description, typeId } = req.body;

  if (!title || !description) {
    res.status(400).json("Invalid title or description");
    return;
  }

  // Check whether the Ids is valid
  const type = await db
    .select()
    .from(schema.requestType)
    .where(eq(schema.requestType.id, typeId));

  if (type.length === 0) {
    res.status(400).json("Type not found");
    return;
  }
  const pendingState = 1; // Default state is 1 (Pending)

  await db.insert(schema.request).values({
    userId: res.locals.user.id,
    stateId: pendingState,
    typeId: typeId,
    title: title,
    description: description,
  });
  console.log("Request created");
  res.status(201).send();
};
