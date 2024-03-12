import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { and, eq } from "drizzle-orm";

export const postUpvote = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  if (!requestId) {
    res.status(400).json("Invalid request id");
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

  const upvote = await db
    .select()
    .from(schema.requestUpvote)
    .where(
      and(
        eq(schema.requestUpvote.userId, res.locals.user.id),
        eq(schema.requestUpvote.requestId, requestId)
      )
    );

  if (upvote.length > 0) {
    await db
      .delete(schema.requestUpvote)
      .where(
        and(
          eq(schema.requestUpvote.userId, res.locals.user.id),
          eq(schema.requestUpvote.requestId, requestId)
        )
      );
    res.status(200).json("Upvote removed");
    return;
  }

  await db.insert(schema.requestUpvote).values({
    userId: res.locals.user.id,
    requestId: requestId,
  });

  res.status(201).send();
};
