import express from "express";
import {
  getAQIForecastByCity,
  getAQIForecastByLocation,
} from "../controllers/forecast.controllers.js";

const router = express.Router();

router.get("/location", getAQIForecastByLocation); 
router.get("/:city", getAQIForecastByCity);        

export default router;