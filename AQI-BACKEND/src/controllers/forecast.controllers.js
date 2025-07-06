import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { getForecast } from "../services/forecast.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const getAQIForecastByCity = asyncHandler(async (req, res) => {
  const { city } = req.params;
  if (!city) throw new ApiError(400, "City is required");

  const forecast = await getForecast({ city });
  res.status(200).json(new ApiResponse(200, forecast, "Forecast fetched successfully"));
});


const getAQIForecastByLocation = asyncHandler(async (req, res) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng) throw new ApiError(400, "Latitude and longitude are required");

  const forecast = await getForecast({
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    radius: radius ? parseFloat(radius) : undefined,
  });

  res.status(200).json(new ApiResponse(200, forecast, "Forecast fetched successfully"));
});


export { getAQIForecastByCity, getAQIForecastByLocation };