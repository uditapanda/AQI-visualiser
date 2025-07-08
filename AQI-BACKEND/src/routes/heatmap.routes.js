import express from "express";
import { getHeatmapPoints } from "../controllers/heatmap.controllers.js";

const router = express.Router();

router.get("/points", getHeatmapPoints);

export default router;