import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomJWTPayload } from "../config/jwt.interface";
const User = require("../models/user.model");

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode the token to get the user's ID
      const decodedToken = jwt.verify(
        token,
        "myJWTSecretForECX"
      ) as CustomJWTPayload;

      const user = await User.findById(decodedToken.id).select("-password");

      if (!user) {
        // If no user is found in the database
        res.status(401).json({
          message: "No user found",
        });
        return;
      }

      req.user = { id: user._id };

      next();
    } catch (error: any) {
      res.status(401).json({
        message: "Not Authorized",
      });
      return;
    }
  } else {
    res.status(401).json({
      message: "Not Authorized, no token!",
    });
    return;
  }
};
