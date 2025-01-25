"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const requestLogger_middleware_1 = require("./middleware/requestLogger.middleware");
const errorHandler_1 = require("./config/errorHandler");
const port = 5000;
(0, db_1.connectDb)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(requestLogger_middleware_1.requestLogger);
app.use("/", user_routes_1.default);
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => console.log(`Server started on ${port}`));
}
exports.default = app;
