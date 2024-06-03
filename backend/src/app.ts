import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import { connectToDatabase } from "../database/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import { getCurrentDate } from "../utils/date";

const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:3000",
    // allow credentials (e.g., cookies, authorization headers)
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", router);

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy and running!",
    status: "OK",
    date: getCurrentDate(),
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});
app.listen(port, async () => {
  await connectToDatabase();
  return console.log(
    "\x1b[32m",
    `Express is listening at http://localhost:${port}`,
    "\x1b[0m"
  );
});
