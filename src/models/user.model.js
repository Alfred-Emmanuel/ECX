"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    age: {
        type: Number,
        required: [true, "Please provide your age in number format"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    }
});
module.exports = mongoose_1.default.model('User', userSchema);
