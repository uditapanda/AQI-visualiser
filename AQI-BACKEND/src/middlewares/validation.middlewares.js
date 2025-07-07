import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return next()
  }

  return next(new ApiError(400, "Invalid ObjectId format"));
};


const validateAQICreation = (req, res, next) => {
  const { latitude, longitude, city, aqi } = req.body;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    typeof city !== "string" ||
    typeof aqi !== "number"
  ) {
    throw new ApiError(400, "Invalid AQI data");
  }

  next();
};


const validateCoordinates = (req, res, next) => {
  const { lat, lng } = req.params;
  
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      success: false,
      message: "Invalid coordinates. Latitude and longitude must be numbers."
    });
  }
  
 
  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be between -90 and 90"
    });
  }
  
  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be between -180 and 180"
    });
  }
  
  next();
};



export { validateObjectId, validateAQICreation, validateCoordinates };