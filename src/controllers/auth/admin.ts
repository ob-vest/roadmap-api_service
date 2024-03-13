import { NextFunction } from "express";
import * as schema from "../../database/schema";
import { Request, Response } from "express";
// Middleware to check if the user is admin

export const admin = (req: Request, res: Response, next: NextFunction) => {
  const user: typeof schema.user = res.locals.user;
  if (!user.isAdmin) {
    res.status(403).json("You are not an admin");
    return;
  }
  console.log("Admin Authenticated");
  next();
};
