CREATE TABLE heatmap_points (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50),  -- optional: 'upload', 'predicted', etc.
  intensity FLOAT DEFAULT 1.0,
  geom GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name TEXT,
  geom GEOMETRY(POLYGON, 4326)
);