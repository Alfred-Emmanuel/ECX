import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Incoming Request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });

  next();
};
