import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { desc, eq } from "drizzle-orm";

export const getCommentsByRequest = async (req: Request, res: Response) => {
  // Make sure requestId is a number
  if (isNaN(parseInt(req.params.requestId))) {
    res.status(400).send("Invalid request ID");
    return;
  }

  const requestId = parseInt(req.params.requestId); // Convert string to number

  const comments = await db
    .select({
      id: schema.comment.id,
      userId: schema.comment.userId,
      text: schema.comment.text,
      createdAt: schema.comment.createdAt,
      isDeveloper: schema.user.isAdmin,
    })
    .from(schema.comment)
    .where(eq(schema.comment.requestId, requestId))
    .leftJoin(schema.user, eq(schema.comment.userId, schema.user.id))
    .orderBy(desc(schema.comment.createdAt));

  res.send(comments);
};
