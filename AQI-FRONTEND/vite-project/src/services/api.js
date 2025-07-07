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

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const searchPlaces = async (query) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=in&limit=5`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch from Mapbox");
  const data = await res.json();

  return data.features.map((feature) => ({
    name: feature.place_name,
    lat: feature.center[1],
    lng: feature.center[0],
  }));
};