import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { estimateAQI } from "../services/interpolation.services.js";
import { HeatmapPoint } from "../models/heatmap.models.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });
await mongoose.connect(process.env.MONGODB_URI_HEATMAP);
console.log("Connected to MongoDB");

const gridPath = join(__dirname, "india_grid.json");
const grid = JSON.parse(fs.readFileSync(gridPath, "utf-8"));

let totalSaved = 0;

for (const { lat, lng } of grid) {
  console.log(`Estimating AQI at (${lat}, ${lng})...`);

  try {
    const result = await Promise.race([
      estimateAQI(lat, lng),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Estimation timeout")), 5000)
      ),
    ]);

    if (result?.aqi) {
      await HeatmapPoint.create({
        latitude: lat,
        longitude: lng,
        aqi: result.aqi,
        note: "Estimated from grid",
      });
      totalSaved++;
      console.log(`Saved AQI ${result.aqi} at (${lat}, ${lng})`);
    } else {
      console.log(`No valid AQI estimated at (${lat}, ${lng})`);
    }
  } catch (err) {
    console.error(`Error at (${lat}, ${lng}):`, err.message);
  }
}

console.log(`Done! Saved ${totalSaved} heatmap points.`);


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

const dumpPath = join(__dirname, "../../public/heatmap_dump.json");
fs.mkdirSync(join(__dirname, "../../public"), { recursive: true });
fs.writeFileSync(dumpPath, JSON.stringify(geojson, null, 2));
console.log(`Dumped ${points.length} points to public/heatmap_dump.json`);

process.exit();