import { Request, Response } from "express";
import { db } from "../database/db-connect";
import * as schema from "../database/schema";
import { and, count, countDistinct, eq, sql } from "drizzle-orm";

export const getRequests = async (req: Request, res: Response) => {
  const user: typeof schema.user = res.locals.user;
  // const didUpvote = db
  //   .select()
  //   .from(schema.requestUpvote)
  //   .where(
  //     and(
  //       eq(schema.requestUpvote.userId, user.id),
  //       eq(schema.requestUpvote.requestId, schema.request.id)
  //     )
  //   );

  const requestResult = await db
    .select({
      id: schema.request.id,
      upvoteCount: countDistinct(schema.requestUpvote.userId).mapWith(
        schema.requestUpvote.requestId
      ),
      //   upvoteCount: countDistinct(schema.upvote.requestId, schema.upvote.userId),
      commentCount: count(schema.comment),
      title: schema.request.title,
      description: schema.request.description,
      stateId: schema.request.stateId,
      typeId: schema.request.typeId,
      createdAt: schema.request.createdAt,
      lastActivityAt: schema.request.lastActivityAt,
      didUpvote: user
        ? sql`COALESCE(BOOL_OR(${schema.requestUpvote.userId} = ${user.id}), FALSE)`
        : sql`FALSE`,
    })
    .from(schema.request)
    .leftJoin(
      schema.requestUpvote,
      eq(schema.requestUpvote.requestId, schema.request.id)
    )
    .leftJoin(schema.comment, eq(schema.comment.requestId, schema.request.id))
    .groupBy(schema.request.id);

  res.send(requestResult);
};
