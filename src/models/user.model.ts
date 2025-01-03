import { mongo } from "mongoose"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('User', userSchema)