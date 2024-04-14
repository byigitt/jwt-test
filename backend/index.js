import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import db from "./helpers/db.js";
import api from "./routes/api/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(api);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `cant find ${req.originalUrl} on this server!`,
  });
});

app.listen(process.env.PORT, async () => {
  await db();
  console.log(`running on - http://localhost:${process.env.PORT}`);
});
