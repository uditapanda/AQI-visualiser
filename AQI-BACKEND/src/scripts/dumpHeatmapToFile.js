import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { HeatmapPoint } from "../models/heatmap.models.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });
await mongoose.connect(process.env.MONGODB_URI_HEATMAP);
console.log("Connected to MongoDB");

const points = await HeatmapPoint.find({}, "latitude longitude aqi timestamp");

const geojson = {
  type: "FeatureCollection",
  features: points.map((point) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
    properties: {
      aqi: point.aqi,
      timestamp: point.timestamp,
    },
  })),
};

const dumpFolder = join(__dirname, "../../public");
fs.mkdirSync(dumpFolder, { recursive: true });

const dumpPath = join(dumpFolder, "heatmap_dump.json");
fs.writeFileSync(dumpPath, JSON.stringify(geojson, null, 2));

console.log(`Dumped ${points.length} points to public/heatmap_dump.json`);
process.exit();