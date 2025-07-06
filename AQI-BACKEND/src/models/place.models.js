import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: String,
  state: String,
  district: String,
  type: String,
  lat: Number,
  lng: Number,
});

const Place = mongoose.model("Place", placeSchema);

export { Place };