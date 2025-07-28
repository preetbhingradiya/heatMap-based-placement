import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";
import { insertPoint } from "../common/insertPoint";
import { pool } from "../config/db";

export const upload = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).send("No file uploaded");

    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === ".csv") {
      //   const results: number[][] = [];
      const results: Promise<void>[] = [];
      console.log(file);

      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on("data", (data) => {
          const lat = parseFloat(data.lat || data.latitude);
          const lng = parseFloat(data.lng || data.longitude);
          //   if (!isNaN(lat) && !isNaN(lng)) results.push([lat, lng]);
          if (!isNaN(lat) && !isNaN(lng)) {
            results.push(insertPoint(lat, lng));
          }
        })
        .on("end", async () => {
          await Promise.all(results);
          res.status(200).send("CSV data inserted successfully");
        });
      console.log(results);
    } else if (extension === ".geojson") {
      const geojson = JSON.parse(fs.readFileSync(file.path, "utf-8"));
      //   const coords: number[][] = [];

      const inserts = geojson.features.forEach((feature: any) => {
        const [lng, lat] = feature.geometry.coordinates;
        // coords.push([lat, lng]);
        return insertPoint(lat, lng);
      });

      await Promise.all(inserts);
      fs.unlinkSync(file.path);
      //   res.json(coords);
      res.status(200).send("GeoJSON data inserted successfully");
    } else {
      fs.unlinkSync(file.path);
      res.status(400).send("Unsupported file type");
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

export const getZonData = async (req: Request, res: Response) => {
  const zoneId = req.params.zone_id;
  console.log(zoneId);

  const result = await pool.query(
    `
    SELECT 
    ST_AsText(hp.geom) AS point,
    ST_Distance(
        ST_SetSRID(hp.geom::geometry, 4326),
        ST_SetSRID(z.geom, 4326)
    ) AS distance_in_degrees
    FROM heatmap_points hp
    JOIN zones z ON z.id = $1
        `,
    [zoneId]
  );

  res.json(result.rows);
};

export const setLocations = async (req: Request, res: Response) => {
  const { latitude, longitude, userId } = req.body;
  
  if (!latitude || !longitude || !userId) {
    return res.status(400).json({ error: "Missing lat, lng or userId" });
  }

  try {
    await pool.query(
      "INSERT INTO locations (latitude, longitude, user_id) VALUES ($1, $2, $3)",
      [latitude, longitude, userId]
    );

    console.log("📍 New position recorded:", { latitude, longitude, userId });
    res.status(201).json({ message: "Location stored successfully" });
  } catch (err) {
    console.error("❌ Error inserting location:", err);
    res.sendStatus(500);
  }
};


export const getLocations = async (req: Request, res: Response) => {
  const userId = req.params.user_id as string;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }

  try {
    const result = await pool.query(
      "SELECT latitude, longitude, timestamp FROM locations WHERE user_id = $1 ORDER BY timestamp ASC",
      [userId]
    );

    console.log(`📦 Fetched ${result.rowCount} locations for ${userId}`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching locations:", err);
    res.sendStatus(500);
  }
};