import mongoose from "mongoose";
import fs from "fs";

import { Place } from "../models/place.models.js";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });
console.log("MONGODB_URI from .env:");



const rawData = fs.readFileSync("./src/places.json", "utf-8");
const rawPlaces = JSON.parse(rawData);

const run = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI_PLACES;
    if (!mongoURI) throw new Error("MONGODB_URI not defined in .env");

    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB", mongoose.connection.name);

    await Place.deleteMany({});
    console.log("Old places cleared");

    const places = rawPlaces.map((p) => ({
      name: p.city,
      state: p.state,
      district: p.district,
      type: "city",
      lat: p.latitude,
      lng: p.longitude,
      latitude: p.latitude,
      longitude: p.longitude
    }));

    await Place.insertMany(places);
    console.log(`Inserted ${places.length} places`);

    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();