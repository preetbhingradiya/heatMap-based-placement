import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/uploadDataset";
import {pool } from "./config/db"

export const app = express();

app.use(cors({
  origin: "*", // or restrict to your frontend ngrok URL
}));
app.use(express.json())
app.use("/user", router)

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  } else {
    console.log("✅ PostgreSQL connected at:", res.rows[0].now);
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
  