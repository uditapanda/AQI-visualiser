import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { estimateAQI } from "../services/interpolation.services.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

function getAQIAdvisory(aqiRaw) {
  const aqi = Number(aqiRaw);

  if (isNaN(aqi) || aqi === 0) return "AQI data unavailable for this location.";

  if (aqi <= 50) return "Air quality is good. Enjoy your day!";
  if (aqi <= 100)
    return "Air is acceptable. Sensitive groups should monitor symptoms.";
  if (aqi <= 200)
    return "Avoid prolonged outdoor activity. Wear a mask if needed.";
  if (aqi <= 300)
    return "Very poor air. Avoid outdoor exercise. Use air purifiers.";
  if (aqi > 300)
    return "Hazardous! Stay indoors, keep windows closed, use N95 masks if going out.";

  return "AQI value is invalid or undefined.";
}

const getEstimatedAQI = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, "Latitude and Longitude are required.");
  }

  let result = null;
  let note = "";

  const userRadius = req.query.radius ? parseFloat(req.query.radius) : 50;
  result = await estimateAQI(lat, lng, userRadius);
  if (result) note = `Estimated using stations within ${userRadius} km.`;

  if (!result) {
    result = await estimateAQI(lat, lng, 200);
    if (result) note = "Estimated using stations within 200 km.";
  }

  if (!result) {
    result = await estimateAQI(lat, lng, 1000);
    if (result) note = "Estimated using stations within 1000 km.";
  }

  if (!result) {
    result = await estimateAQI(lat, lng, Number.MAX_SAFE_INTEGER);
    if (result)
      note = "Estimated using all available stations (very rough estimate).";
  }

  if (!result) {
    throw new ApiError(404, "No AQI data found to estimate.");
  }

  const rawAQI = result.aqi ?? result.estimatedAQI;
  const isEstimated =
    result.estimatedAQI !== undefined ||
    (note && note.toLowerCase().includes("estimated"));

  const advisory = getAQIAdvisory(rawAQI);


  res.status(200).json(
    new ApiResponse(
      200,
      {
        ...result,
        advisory,
        note,
        estimated: isEstimated,
        timestamp: result.nearestStation?.timestamp || new Date().toISOString(),
      },
      isEstimated
        ? "Estimated AQI calculated successfully."
        : "Official AQI retrieved from nearest station."
    )
  );
});

export { getEstimatedAQI, getAQIAdvisory };