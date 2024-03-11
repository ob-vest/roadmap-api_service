import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";

export const postComment = async (req: Request, res: Response) => {
  const { requestId, comment } = req.body;
  const user: typeof schema.user = res.locals.user;

  if (!requestId || !comment) {
    res.status(400).json("Invalid requestId or comment");
    return;
  }
  const request = await db
    .select()
    .from(schema.request)
    .where(eq(schema.request.id, requestId));

  if (request.length === 0) {
    res.status(400).json("Request not found");
    return;
  }

  await db.insert(schema.comment).values({
    userId: Number(user.id),
    requestId: requestId,
    text: comment,
  });

  res.status(201).send();
};
