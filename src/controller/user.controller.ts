import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "../middleware/validate.middleware";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../middleware/error.middleware";
const User = require("../models/user.model");

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface SearchQuery {
  age: string;
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = registerSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }

    const { name, email, age, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new ValidationError("Email alreay Exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      age,
      password: hashedPassword,
    });

    if (user) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        age,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      message: error.details.map((err) => err.message),
    });
    return;
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
      //   name: user.name,
    });
  } else {
    throw new ValidationError("Invalid Credentials");
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(400).json({
      message: "No logged in user",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError("Invalid ID Format");
  }

  if (!userId) {
    throw new ValidationError("Invalid User");
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  res.status(200).json({ message: user });
};

export const getUsers = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response
) => {
  try {
    const userAge = req.query.age;
    const query: { age?: { $gt: number } } = {};

    if (userAge) {
      const age = parseInt(userAge, 10);
      if (isNaN(age)) {
        res.status(400).json({ message: "Invalid age parameter" });
        return;
      }
      query.age = { $gt: age };
    }

    const users = await User.find(query).select("-password");
    res.status(200).json({ messgae: users });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, "myJWTSecretForECX", {
    expiresIn: "30d",
  });
};
