import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().min(3).max(100).required(),
  age: Joi.number().required(),
  password: Joi.string().min(8).max(100).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(100).required(),
  password: Joi.string().min(8).max(100).required(),
});

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

export const userParamsSchema = Joi.object({
  userId: Joi.string().min(8).required(),
});
