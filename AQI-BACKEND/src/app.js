import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import aqiRouter from "./routes/aqi.routes.js";

app.use("/api/v1/aqi", aqiRouter);

import heatmapRouter from "./routes/heatmap.routes.js";

console.log("heatmapRouter loaded");

app.use("/api/v1/heatmap", heatmapRouter);

import forecastRoutes from "./routes/forecast.routes.js";

app.use("/api/v1/forecast", forecastRoutes);

import placeRouter from "./routes/place.routes.js";

app.use("/api/v1/places", placeRouter);


export default app;