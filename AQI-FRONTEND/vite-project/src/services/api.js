import axios from "axios";

const AQI_API = axios.create({
  baseURL: "http://localhost:8000/api/v1/aqi",
});

const FORECAST_API = axios.create({
  baseURL: "http://localhost:8000/api/v1/forecast",
});

const PLACE_API = axios.create({
  baseURL: "http://localhost:8000/api/v1/places",
});

export const fetchAQIByCity = async (city) => {
  try {
    return await AQI_API.get(`/latest/${city}`);
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};

export const fetchPlaceByName = (name) =>
  PLACE_API.get(`/search?name=${name.toLowerCase()}`);

export const fetchAQIByLocation = (lat, lng) =>
  AQI_API.get(`/location/${lat}/${lng}`);

export const fetchForecastByCity = (city) =>
  FORECAST_API.get(`/${city}`);

export const fetchForecastByLocation = (lat, lng, radius = 50) =>
  FORECAST_API.get(`/location?lat=${lat}&lng=${lng}&radius=${radius}`);

export const fetchHistoryByCity = (city) =>
  AQI_API.get(`/history/${city}`);

export const fetchEstimateByLocation = (lat, lng) =>
  AQI_API.get(`/estimate?lat=${lat}&lng=${lng}`);