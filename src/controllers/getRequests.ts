import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { countDistinct, eq } from "drizzle-orm";

export const getRequests = async (req: Request, res: Response) => {
  const requestResult = await db
    .select({
      id: schema.request.id,
      upvoteCount: countDistinct(schema.upvote.userId).mapWith(
        schema.upvote.requestId
      ),
      //   upvoteCount: countDistinct(schema.upvote.requestId, schema.upvote.userId),
      commentCount: countDistinct(schema.comment.requestId),
      requestTitle: schema.request.title,
    })
    .from(schema.request)
    .leftJoin(schema.upvote, eq(schema.upvote.requestId, schema.request.id))
    .leftJoin(schema.comment, eq(schema.comment.requestId, schema.request.id))
    .groupBy(schema.request.id);

  res.send(requestResult);
};
