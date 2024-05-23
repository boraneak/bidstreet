import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { connectToDatabase } from "../database/db";

const app = express();
const port = process.env.PORT;
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, async () => {
  await connectToDatabase();
  return console.log(`Express is listening at http://localhost:${port}`);
});
