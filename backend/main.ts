import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/uploadDataset";

export const app = express();

app.use(cors());
app.use("/user", router)

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
  