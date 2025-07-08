import mongoose from "mongoose";

const heatmapSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  aqi: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: String,
}, { collection: "heatmap_points" });

export const HeatmapPoint = mongoose.model("HeatmapPoint", heatmapSchema);