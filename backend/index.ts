import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  const file = req.file;

  if (!file) return res.status(400).send("No file uploaded");

  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".csv") {
    const results: number[][] = [];

    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", (data) => {
        const lat = parseFloat(data.lat || data.latitude);
        const lng = parseFloat(data.lng || data.longitude);
        if (!isNaN(lat) && !isNaN(lng)) results.push([lat, lng]);
      })
      .on("end", () => {
        fs.unlinkSync(file.path);
        res.json(results);
      });
  } else if (extension === ".geojson") {
    const geojson = JSON.parse(fs.readFileSync(file.path, "utf-8"));
    const coords: number[][] = [];

    geojson.features.forEach((feature: any) => {
      const [lng, lat] = feature.geometry.coordinates;
      coords.push([lat, lng]);
    });

    fs.unlinkSync(file.path);
    res.json(coords);
  } else {
    fs.unlinkSync(file.path);
    res.status(400).send("Unsupported file type");
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
  