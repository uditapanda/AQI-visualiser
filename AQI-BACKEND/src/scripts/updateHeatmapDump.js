import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { HeatmapPoint } from "../models/heatmap.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

await mongoose.connect(process.env.MONGODB_URI_HEATMAP);
console.log("Connected to MongoDB");

const allPoints = await HeatmapPoint.find({});
console.log(`Fetched ${allPoints.length} latest heatmap points from DB`);

const dumpPath = path.join(__dirname, "../../public/heatmap_dump.json");
fs.writeFileSync(dumpPath, JSON.stringify(allPoints, null, 2));
console.log(`Updated heatmap_dump.json with ${allPoints.length} records`);

process.exit();