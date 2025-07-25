import {pool } from '../config/db'

export  const insertPoint = async (lat: number, lng: number, source = "upload", intensity = 1) => {
    await pool.query(
      `INSERT INTO heatmap_points (source, intensity, geom)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))`,
      [source, intensity, lng, lat]
    );
  };