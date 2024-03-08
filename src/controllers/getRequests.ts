import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { countDistinct, eq } from "drizzle-orm";

export const getRequests = async (req: Request, res: Response) => {
  const requestResult = await db
    .select({
      id: schema.request.id,
      upvoteCount: countDistinct(schema.requestUpvote.userId).mapWith(
        schema.requestUpvote.requestId
      ),
      //   upvoteCount: countDistinct(schema.upvote.requestId, schema.upvote.userId),
      commentCount: countDistinct(schema.comment.requestId),
      title: schema.request.title,
      description: schema.request.description,
      state: schema.requestState.title,
      tag: schema.requestType.title,
      createdAt: schema.request.createdAt,
    })
    .from(schema.request)
    .leftJoin(
      schema.requestUpvote,
      eq(schema.requestUpvote.requestId, schema.request.id)
    )
    .leftJoin(schema.comment, eq(schema.comment.requestId, schema.request.id))
    .leftJoin(
      schema.requestState,
      eq(schema.requestState.id, schema.request.stateId)
    )
    .leftJoin(
      schema.requestType,
      eq(schema.requestType.id, schema.request.typeId)
    )
    .groupBy(
      schema.request.id,
      schema.requestState.title,
      schema.requestType.title
    );

  res.send(requestResult);
};
