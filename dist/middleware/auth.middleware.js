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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User = require("../models/user.model");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // Decode the token to get the user's ID
            const decodedToken = jsonwebtoken_1.default.verify(token, "myJWTSecretForECX");
            const user = yield User.findById(decodedToken.id).select("-password");
            if (!user) {
                // If no user is found in the database
                res.status(401).json({
                    message: "No user found",
                });
                return;
            }
            req.user = { id: user._id };
            next();
        }
        catch (error) {
            res.status(401).json({
                message: "Not Authorized",
            });
            return;
        }
    }
    else {
        res.status(401).json({
            message: "Not Authorized, no token!",
        });
        return;
    }
});
exports.protect = protect;
