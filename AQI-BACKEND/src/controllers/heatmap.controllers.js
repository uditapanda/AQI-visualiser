import { HeatmapPoint } from "../models/heatmap.models.js";

export const getHeatmapPoints = async (req, res) => {
  try {
    const points = await HeatmapPoint.find({}, "latitude longitude aqi");

    const geojson = {
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          aqi: Math.round(point.aqi),
        },
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Failed to fetch heatmap points:", err);
    res.status(500).json({ message: "Error fetching heatmap points." });
  }
};