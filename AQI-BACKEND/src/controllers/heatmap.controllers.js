import { AQI } from "../models/aqi.models.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getHeatmapPoints = asyncHandler(async (req, res) => {
  
  const data = await AQI.find(
    {
      latitude: { $exists: true },
      longitude: { $exists: true },
      aqi: { $exists: true }
    },
    {
      latitude: 1,
      longitude: 1,
      aqi: 1,
      _id: 0
    }
  ).limit(1000);

  if (!data || data.length === 0) {
    throw new ApiError(404, "No AQI heatmap points found");
  }

  return res.status(200).json(
    new ApiResponse(200, data, "Heatmap AQI points fetched")
  );
});

export { getHeatmapPoints };