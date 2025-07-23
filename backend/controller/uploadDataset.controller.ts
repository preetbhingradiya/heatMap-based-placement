import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";

export const upload = (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).send("No file uploaded");

    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === ".csv") {
      const results: number[][] = [];
        console.log(file);
        
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
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
