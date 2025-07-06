import mongoose from "mongoose";

const aqiSchema = new mongoose.Schema({
  
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  aqi: {
    type: Number,
    required: true,
  },
  pm25:{
    type: Number,
  },
  pm10: {
    type: Number,
  },
  no2: {
    type: Number,
  },
  o3: {
    type: Number,
  },
  co: {
    type: Number,
  },
  so2: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: {
    expireAfterSeconds: 60 * 24 * 60 * 60,
  },
  },
});

export const AQI = mongoose.model("AQI", aqiSchema);