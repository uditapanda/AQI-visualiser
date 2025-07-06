import { Place } from "../models/place.models.js";

const searchPlaceByName = async (req, res) => {
  const name = req.query.name?.toLowerCase();

  if (!name) return res.status(400).json({ message: "Place name is required" });

const place = await Place.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

  if (!place)
    return res.status(404).json({ message: "Place not found in database" });

  res.json({
    lat: place.lat,
    lng: place.lng,
    name: place.name,
    state: place.state,
    district: place.district,
  });
};

export { searchPlaceByName };