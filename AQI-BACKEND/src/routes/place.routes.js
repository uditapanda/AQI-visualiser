import express from "express";
import { searchPlaceByName, getAllPlaces } from "../controllers/place.controllers.js";

const router = express.Router();

router.get("/search", searchPlaceByName);
router.get("/all", getAllPlaces);

export default router;