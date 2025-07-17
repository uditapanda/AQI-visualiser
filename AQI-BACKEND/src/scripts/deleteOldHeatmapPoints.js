import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { HeatmapPoint } from "../models/heatmap.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

await mongoose.connect(process.env.MONGODB_URI_HEATMAP);
console.log("Connected to MongoDB");

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
const result = await HeatmapPoint.deleteMany({ timestamp: { $lt: threeDaysAgo } });
console.log(`Deleted ${result.deletedCount} heatmap points older than 3 days from DB`);

const heatmapPath = path.join(__dirname, "../../public/heatmap_dump/heatmap.json");

try {
  const rawData = fs.readFileSync(heatmapPath, "utf-8");
  const geojson = JSON.parse(rawData);

  const filteredFeatures = geojson.features.filter((f) => {
    const ts = new Date(f.properties.timestamp);
    return ts >= threeDaysAgo;
  });

  const updatedGeoJSON = {
    type: "FeatureCollection",
    features: filteredFeatures,
  };

  fs.writeFileSync(heatmapPath, JSON.stringify(updatedGeoJSON, null, 2));
  console.log(`Cleaned heatmap_dump: Removed ${geojson.features.length - filteredFeatures.length} old points`);
} catch (err) {
  console.error("Error updating heatmap_dump:", err);
}

process.exit();