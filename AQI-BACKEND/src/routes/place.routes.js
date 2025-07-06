import express from "express";
import { searchPlaceByName } from "../controllers/place.controllers.js";

const router = express.Router();

router.get("/search", searchPlaceByName);

export default router;