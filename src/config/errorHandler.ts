import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../middleware/error.middleware";
import logger from "./logger";

export const errorHandler: ErrorRequestHandler = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.error("Error: ", {
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    });

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
