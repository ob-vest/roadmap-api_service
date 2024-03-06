import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";
const client = new Client({
  host: process.env.PLANETSCALE_DB_HOST,
  username: process.env.PLANETSCALE_DB_USERNAME,
  password: process.env.PLANETSCALE_DB_PASSWORD,
});

export const db = drizzle(client, { schema });

// // Inserting Users
// db.insert(schema.user)
//   .values({
//     idToken: "User1IDTOKEN",
//     refreshToken: "User1Token",
//     isBlocked: false,
//     isAdmin: true,
//   })
//   .execute();

// db.insert(schema.user)
//   .values({
//     idToken: "User2IDTOKEN",
//     refreshToken: "User2Token",
//     isBlocked: false,
//     isAdmin: false,
//   })
//   .execute();

// db.insert(schema.user)
//   .values({
//     idToken: "User3IDTOKEN",
//     refreshToken: "User3Token",
//     isBlocked: true,
//     isAdmin: false,
//   })
//   .execute();

// // Inserting Request Types
// db.insert(schema.requestType).values({ title: "Feature" }).execute();

// db.insert(schema.requestType).values({ title: "Improvement" }).execute();

// // Inserting Request States
// db.insert(schema.requestState).values({ title: "Open" }).execute();

// db.insert(schema.requestState).values({ title: "Closed" }).execute();

// // Inserting Requests with different states, types, and users
// for (let i = 1; i <= 5; i++) {
//   db.insert(schema.request)
//     .values({
//       title: `Request Title ${i}`,
//       description: `Description for request ${i}`,
//       stateId: (i % 2) + 1, // Alternates between 1 and 2
//       typeId: (i % 2) + 1, // Alternates between 1 and 2
//       userId: (i % 3) + 1, // Cycles through 1, 2, and 3
//     })
//     .execute();
// }

// // Inserting Comments for the first 5 requests
// for (let i = 1; i <= 5; i++) {
//   db.insert(schema.comment)
//     .values({
//       text: `Comment ${i} on Request`,
//       requestId: i,
//       userId: ((i + 1) % 3) + 1, // Cycles through 2, 3, and 1
//     })
//     .execute();
// }

// // Inserting Upvotes for requests, simulating multiple upvotes per request
// for (let userId = 1; userId <= 3; userId++) {
//   for (let requestId = 1; requestId <= 5; requestId++) {
//     db.insert(schema.upvote)
//       .values({
//         userId: userId,
//         requestId: requestId,
//       })
//       .execute();
//   }
// }
