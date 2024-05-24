import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { connectToDatabase } from "../database/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, async () => {
  await connectToDatabase();
  return console.log(
    "\x1b[32m",
    `Express is listening at http://localhost:${port}`,
    "\x1b[0m"
  );
});
