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

const BATCH_SIZE = 100;
let totalSaved = 0;

for (let i = 0; i < grid.length; i += BATCH_SIZE) {
  const batch = grid.slice(i, i + BATCH_SIZE);

  const results = await Promise.allSettled(
    batch.map(({ lat, lng }) =>
      estimateAQI(lat, lng).then((estimation) => ({ estimation, lat, lng }))
    )
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { estimation, lat, lng } = result.value;
      if (estimation?.aqi) {
        await HeatmapPoint.create({
          latitude: lat,
          longitude: lng,
          aqi: estimation.aqi,
          note: "Estimated from grid",
        });
        totalSaved++;
        console.log(`Saved ${estimation.aqi} at (${lat}, ${lng})`);
      }
    } else {
      console.error("Error:", result.reason);
    }
  }

  console.log(`Batch ${i / BATCH_SIZE + 1} done`);
}

console.log(`Saved ${totalSaved} heatmap points`);
process.exit();