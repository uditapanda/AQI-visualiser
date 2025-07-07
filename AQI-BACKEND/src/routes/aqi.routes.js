import { Router } from "express";
import { createAQI, getAQI, getSingleAQI, updateAQI, deleteAQI, getAQIByLocation, getLatestAQIByCity, getAQIHistory, getAllAQIPoints } from "../controllers/aqi.controllers.js";
import { validateObjectId, validateAQICreation, validateCoordinates } from "../middlewares/validation.middlewares.js";

const router = Router();

import { getEstimatedAQI } from "../controllers/interpolation.controllers.js";

router.get("/estimate", getEstimatedAQI);

router.get("/all-records", getAllAQIPoints);


router.post("/", validateAQICreation, createAQI);
router.get("/", getAQI);


router.get("/latest/:city", getLatestAQIByCity);
router.get("/location/:lat/:lng", validateCoordinates, getAQIByLocation);
router.get("/history/:city", getAQIHistory);


router.route("/:id")
  .get(validateObjectId, getSingleAQI)
  .put(validateObjectId, updateAQI)
  .delete(validateObjectId, deleteAQI);




export default router;