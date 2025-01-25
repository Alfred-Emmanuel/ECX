import express from "express";
import { connectDb } from "./config/db";
import userRouter from "./routes/user.routes";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorHandler } from "./config/errorHandler";

const port = 5000;

connectDb();
const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/", userRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server started on ${port}`));
}

//   app.listen(port, () => console.log(`Server started on ${port}`));


export default app;
