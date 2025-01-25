"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = express_1.default.Router();
userRouter.post("/user/register", user_controller_1.registerUser);
userRouter.post("/user/login", user_controller_1.login);
userRouter.get("/me", auth_middleware_1.protect, user_controller_1.getMe);
userRouter.get("/user/:userId", (0, validate_middleware_1.validateParams)(validate_middleware_1.userParamsSchema), user_controller_1.getUser);
userRouter.get("/users", user_controller_1.getUsers);
exports.default = userRouter;
// Find out why the middleware isn't catching the error.
