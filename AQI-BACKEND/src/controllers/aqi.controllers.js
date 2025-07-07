import { AQI } from "../models/aqi.models.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getHistoricalAQIByCity } from "../services/aqi.services.js";
import { getAQIAdvisory } from "./interpolation.controllers.js";

const createAQI = asyncHandler(async (req, res) => {
  let { latitude, longitude, city, aqi, pm25, pm10, no2, o3, co, so2, timestamp } = req.body;

  if (
    [latitude, longitude, city, aqi].some(
      (field) => field === undefined || field === null || field === ""
    )
  ) {
    return res.status(400).json(new ApiResponse(400, null, "Latitude, longitude, city, and AQI are required."));
  }

  city = city.trim().toLowerCase();
  timestamp = timestamp ? new Date(timestamp) : new Date();

  
  const existingCity = await AQI.findOne({
    city,
    timestamp: timestamp,
  });

  if (existingCity) {
    return res.status(200).json(new ApiResponse(200, null, "Duplicate city AQI — skipped insert"));
  }

  
  const existingLocation = await AQI.findOne({
    latitude,
    longitude,
    timestamp: timestamp,
  });

  if (existingLocation) {
    return res.status(200).json(new ApiResponse(200, null, "Duplicate location AQI — skipped insert"));
  }

  
  const data = await AQI.create({
    latitude,
    longitude,
    city,
    aqi,
    pm25,
    pm10,
    no2,
    o3,
    co,
    so2,
    timestamp,
  });

  return res.status(201).json(new ApiResponse(201, data, "AQI data created successfully"));
});


const getAQI = asyncHandler(async (req, res) => {
  const { location, from, to, page = 1, limit = 100 } = req.query;

  if (from && isNaN(Date.parse(from))) {
    throw new ApiError(400, "Invalid 'from' date format");
  }

  if (to && isNaN(Date.parse(to))) {
    throw new ApiError(400, "Invalid 'to' date format");
  }

  const query = {};

  if (location?.trim()) {
    query.city = location.trim().toLowerCase();
  }

  if (from || to) {
    query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from + "T00:00:00.000Z");
    if (to) query.timestamp.$lte = new Date(to + "T23:59:59.999Z");
  }
  console.log("Date filter:", query.timestamp);

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const data = await AQI.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  if (!data || data.length === 0) {
    throw new ApiError(404, "No AQI data found for the provided filters");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "AQI data retrieved successfully"));
});

const getSingleAQI = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await AQI.findById(id);

  if (!data) {
    throw new ApiError(404, "AQI data not found with this ID");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "AQI record retrieved"));
});

const getLatestAQIByCity = asyncHandler(async (req, res) => {
  const city = req.params.city.trim();

  const data = await AQI.findOne({
    city: { $regex: new RegExp(`^${city}$`, "i") }
  }).sort({ timestamp: -1 });

  if (!data) {
    throw new ApiError(404, "No AQI data found for this city");
  }

  const advisory = getAQIAdvisory(data.aqi);

  return res
    .status(200)
    .json(new ApiResponse(200, { ...data._doc, advisory }, "Latest AQI data retrieved"));
});

const getAQIByLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.params;

  const latFloat = Number.parseFloat(lat);
  const lngFloat = Number.parseFloat(lng);

  if (Number.isNaN(latFloat) || Number.isNaN(lngFloat)) {
    throw new ApiError(400, "Invalid latitude or longitude");
  }

  const minLat = latFloat - 0.5;
  const maxLat = latFloat + 0.5;
  const minLng = lngFloat - 0.5;
  const maxLng = lngFloat + 0.5;

  
const stats = await AQI.aggregate([
  {
    $match: {
      latitude: { $gte: minLat, $lte: maxLat },
      longitude: { $gte: minLng, $lte: maxLng },
      timestamp: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }, // last 6 hours
    },
  },
  {
    $group: {
      _id: null,
      avgAQI: { $avg: "$aqi" },
      minAQI: { $min: "$aqi" },
      maxAQI: { $max: "$aqi" },
      count: { $sum: 1 },
      latest: { $max: "$timestamp" },
    },
  },
]);

  if (!stats.length) {
    throw new ApiError(404, "No AQI data found for this location");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats[0], "Aggregated AQI data by location retrieved")
    );
});

export const getAllAQIPoints = async (req, res) => {
  try {
    const points = await AQI.find({}, "city lat lng aqi").limit(1000);
    res.json(points);
  } catch (err) {
    console.error("Error fetching AQI points:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAQIHistory = asyncHandler(async (req, res) => {
  const city = req.params.city?.trim().toLowerCase();
  const days = parseInt(req.query.days) || 30;

  if (!city) throw new ApiError(400, "City is required");

  const history = await getHistoricalAQIByCity(city, days);

  if (!history.length) {
    throw new ApiError(404, `No AQI history found for city: ${city}`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, history, `Historical AQI data for ${city}`));
});

const updateAQI = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedAqi = await AQI.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedAqi) {
    throw new ApiError(404, "No AQI record found to update");
  }

  res.status(200).json(new ApiResponse(200, updatedAqi, "AQI record updated"));
});

const deleteAQI = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedAqi = await AQI.findByIdAndDelete(id);

  if (!deletedAqi) {
    throw new ApiError(404, "No AQI record found to delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedAqi, "AQI record deleted successfully"));
});

export {
  createAQI,
  getAQI,
  getSingleAQI,
  getAQIByLocation,
  getLatestAQIByCity,
  getAQIHistory,
  updateAQI,
  deleteAQI,
};