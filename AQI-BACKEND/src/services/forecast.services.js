import { AQI } from "../models/aqi.models.js";
import { ApiError } from "../utils/ApiError.js";
import { haversine } from "./interpolation.services.js";

const getForecast = async ({ city, lat, lng, radius = 50 }) => {
  const fallbackLimits = [7, 5, 3, 2];

  if (city) {
    let cityData = [];

    for (const limit of fallbackLimits) {
      cityData = await AQI.find({
        city: { $regex: new RegExp(city, "i") },
      })
        .sort({ timestamp: -1 })
        .limit(limit);

      if (cityData.length === limit) break;
    }

    if (cityData.length < 2)
      throw new ApiError(404, "Not enough historical data to estimate forecast.");

    const timestamps = cityData.map((entry) => new Date(entry.timestamp).getTime());
    const aqis = cityData.map((entry) => entry.aqi);

    const timeDiffs = timestamps.map((t, i) =>
      i === 0 ? 0 : (timestamps[i - 1] - t) / (1000 * 60 * 60 * 24)
    );
    const avgTimeGap = timeDiffs.reduce((a, b) => a + b, 0) / (timeDiffs.length - 1 || 1);

    const slope = (aqis[0] - aqis[aqis.length - 1]) / (aqis.length - 1);
    const forecast = [];

    const lastDate = new Date(cityData[0].timestamp);

    for (let i = 1; i <= 3; i++) {
      const forecastedDate = new Date(lastDate);
      forecastedDate.setDate(forecastedDate.getDate() + i);

      forecast.push({
        date: forecastedDate.toISOString().split("T")[0],
        predictedAQI: Math.round(aqis[0] + slope * i),
      });
    }

    return {
      forecast,
      method: `${cityData.length}-point trend-based forecast (city)`,
      basedOn: cityData.map(({ aqi, timestamp }) => ({ aqi, timestamp })),
      trend:
        slope > 0 ? "rising" : slope < 0 ? "falling" : "stable",
    };
  }

  throw new ApiError(400, "Either city or lat/lng must be provided");
};

export { getForecast };