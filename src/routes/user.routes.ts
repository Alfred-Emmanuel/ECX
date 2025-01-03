import express, { RequestHandler } from "express";
import {
  registerUser,
  login,
  getMe,
  getUser,
  getUsers,
} from "../controller/user.controller";
import {
  validateParams,
  userParamsSchema,
} from "../middleware/validate.middleware";
import { protect } from "../middleware/auth.middleware";

const userRouter = express.Router();

userRouter.post("/user/register", registerUser);
userRouter.post("/user/login", login);
userRouter.get("/me", protect, getMe);
userRouter.get(
  "/user/:userId",
  validateParams(userParamsSchema) as RequestHandler,
  getUser
);
userRouter.get("/users", getUsers);

export default userRouter;

// Find out why the middleware isn't catching the error.
