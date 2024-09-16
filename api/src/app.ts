import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import specs from "../swagger";
import { connectToDatabase } from "../database";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import { getCurrentDate } from "../utils/date";

const app = express();
const port = process.env.PORT || 5000;

// set up rate limiter: maximum of five requests per minute
import { rateLimit } from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // max 5 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);
app.use(
  cors({
    origin: `http://localhost:${process.env.REACT_APP_PORT}`,
    // allow credentials (e.g., cookies, authorization headers)
    credentials: true,
  }),
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
  console.log(`Express is listening at http://localhost:${port}`);
});
