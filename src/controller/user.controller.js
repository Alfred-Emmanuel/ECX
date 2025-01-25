"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = exports.getMe = exports.login = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const User = require("../models/user.model");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = validate_middleware_1.registerSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        const { name, email, age, password } = req.body;
        const userExists = yield User.findOne({ email });
        if (userExists) {
            throw new error_middleware_1.ValidationError("Email alreay Exists");
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield User.create({
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
        }
        else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate_middleware_1.loginSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            message: error.details.map((err) => err.message),
        });
        return;
    }
    const { email, password } = req.body;
    const user = yield User.findOne({ email });
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            email: user.email,
            token: generateToken(user._id),
            //   name: user.name,
        });
    }
    else {
        throw new error_middleware_1.ValidationError("Invalid Credentials");
    }
});
exports.login = login;
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        res.status(200).json(req.user);
    }
    else {
        res.status(400).json({
            message: "No logged in user",
        });
    }
});
exports.getMe = getMe;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new error_middleware_1.ValidationError("Invalid ID Format");
    }
    if (!userId) {
        throw new error_middleware_1.ValidationError("Invalid User");
    }
    const user = yield User.findById(userId).select("-password");
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    res.status(200).json({ message: user });
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAge = req.query.age;
        const query = {};
        if (userAge) {
            const age = parseInt(userAge, 10);
            if (isNaN(age)) {
                res.status(400).json({ message: "Invalid age parameter" });
                return;
            }
            query.age = { $gt: age };
        }
        const users = yield User.find(query).select("-password");
        res.status(200).json({ messgae: users });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
});
exports.getUsers = getUsers;
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, "myJWTSecretForECX", {
        expiresIn: "30d",
    });
};
