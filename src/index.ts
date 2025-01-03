import express from "express"
import { connectDb } from "./config/db"
import userRouter from "./routes/user.routes";

const port = 5000;

connectDb()
const app = express()

app.use(express.json())
app.use('/', userRouter)

app.listen(port, () => console.log(`Server started on ${port}`))