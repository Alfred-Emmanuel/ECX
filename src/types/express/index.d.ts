import * as express from "express";
import { IUser } from "./config/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
