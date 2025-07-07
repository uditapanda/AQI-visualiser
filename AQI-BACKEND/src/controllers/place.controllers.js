import { Place } from "../models/place.models.js";
import { placesFromJSON } from "../utils/LoadPlacesJSON.js";

const searchPlaceByName = async (req, res) => {
  const name = req.query.name?.toLowerCase();

  if (!name) return res.status(400).json({ message: "Place name is required" });

  try {
    const mongoResults = await Place.find({
      name: { $regex: name, $options: "i" },
    }).limit(10);

    if (mongoResults.length > 0) {
      return res.json(
        mongoResults.map((p) => ({
          name: p.name,
          lat: p.lat,
          lng: p.lng,
          state: p.state,
          district: p.district,
          source: "db",
        }))
      );
    }

    const jsonResults = placesFromJSON
      .filter((p) => p.name.toLowerCase().includes(name))
      .slice(0, 10);

    if (jsonResults.length > 0) {
      return res.json(
        jsonResults.map((p) => ({
          name: p.name,
          lat: p.lat,
          lng: p.lng,
          state: p.state,
          district: p.district,
          source: "json",
        }))
      );
    }

    return res.status(404).json({ message: "No matching places found" });
  } catch (err) {
    console.error("Error searching places:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find().limit(1000);
    res.json(places);
  } catch (err) {
    console.error("Error fetching all places:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export { searchPlaceByName, getAllPlaces };