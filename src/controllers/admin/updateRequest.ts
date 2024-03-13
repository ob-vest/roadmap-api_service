// import { Request, Response } from "express";
// import { db } from "../../database/db-connect";
// import * as schema from "../../database/schema";
// import { eq } from "drizzle-orm";

// export const updateRequestADMIN = async (req: Request, res: Response) => {
//   const requestId: number = Number(req.params.requestId);
//   const stateId: number = Number(req.body.stateId);

//   const query = db
//     .update(schema.request)
//     .set({
//       stateId: stateId,
//     })
//     .where(eq(schema.request.id, requestId));

//   const result = await query;
//   res.send(result);
// };
