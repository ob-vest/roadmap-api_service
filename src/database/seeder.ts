import { sql } from "drizzle-orm";
import { db } from "./db-connect";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";

const totalUsers = 50;
const totalRequests = 20;
const totalComments = 50;
const totalUpvotes = 30;

// Seed Request Types
export async function seedRequestTypes() {
  const types = ["Feature", "Improvement", "Bug"];
  for (const type of types) {
    await db.insert(schema.requestType).values({ title: type });
  }
}

// Seed Request States
export async function seedRequestStates() {
  const states = [
    "Pending",
    "Approved",
    "Rejected",
    "Planned",
    "In Progress",
    "Completed",
  ];
  for (const state of states) {
    await db.insert(schema.requestState).values({ title: state });
  }
}

// Seed Users
export async function seedUsers() {
  // Inserting 50 users
  for (let i = 0; i < totalUsers; i++) {
    await db.insert(schema.user).values({
      appleUserId: faker.string.nanoid(20),
      refreshToken: faker.string.nanoid(20),
    });
  }
}

// Seed Requests
export async function seedRequests() {
  // Inserting 100 requests
  for (let i = 0; i < totalRequests; i++) {
    await db.insert(schema.request).values({
      title: faker.lorem.slug({ min: 1, max: 3 }),
      description: faker.lorem.paragraph(),
      stateId: Math.floor(Math.random() * 6) + 1,
      typeId: Math.floor(Math.random() * 3) + 1,
      userId: Math.floor(Math.random() * totalUsers) + 1,
    });
  }
}

// Seed Comments
export async function seedComments() {
  // Inserting 100 comments
  for (let i = 0; i < totalComments; i++) {
    await db.insert(schema.comment).values({
      text: faker.lorem.sentence(),
      requestId: Math.floor(Math.random() * totalRequests) + 1,
      userId: Math.floor(Math.random() * totalUsers) + 1,
    });
  }
}

// Seed Upvotes
export async function seedUpvotes() {
  // Inserting 100 upvotes
  for (let i = 0; i < totalUpvotes; i++) {
    await db.insert(schema.requestUpvote).values({
      userId: Math.floor(Math.random() * totalUsers) + 1,
      requestId: Math.floor(Math.random() * totalRequests) + 1,
    });
  }
}

// Seed the database
export async function seedDatabase() {
  await resetDatabase();
  await seedRequestTypes();
  await seedRequestStates();
  await seedUsers();
  await seedRequests();
  await seedComments();
  await seedUpvotes();
}

// Reset the database
export async function resetDatabase() {
  // Truncate all tables and restart identity
  // https://gist.github.com/ThimoDEV/b071dc83308d6b0a5e165efb6efa4902
  await db.execute(
    sql`TRUNCATE TABLE  request_upvote, comment, request , request_type, request_state, "user" RESTART IDENTITY`
  );
}
