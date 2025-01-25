"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamsSchema = exports.validateParams = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().min(3).max(100).required(),
    age: joi_1.default.number().required(),
    password: joi_1.default.string().min(8).max(100).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().min(3).max(100).required(),
    password: joi_1.default.string().min(8).max(100).required(),
});
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};
exports.validateParams = validateParams;
exports.userParamsSchema = joi_1.default.object({
    userId: joi_1.default.string().min(8).required(),
});
