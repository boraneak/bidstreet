import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import specs from "../swagger";
import { connectToDatabase } from "../database/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import { getCurrentDate } from "../utils/date";

const app = express();
const port = process.env.PORT;

// set up rate limiter: maximum of five requests per minute
import { rateLimit } from "express-rate-limit"
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Server is healthy and running!",
    status: "OK",
    date: getCurrentDate(),
  });
});

app.get("/", (_req, res) => {
  res.send("Welcome to the Express server!");
});
app.listen(port, async () => {
  await connectToDatabase();
  console.log(
    "\x1b[32m",
    `Express is listening at http://localhost:${port}`,
    "\x1b[0m"
  );
});
