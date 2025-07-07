import fs from "fs";
import path from "path";

const loadPlacesFromJSON = () => {
  const filePath = path.join(process.cwd(), "places.json");
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
};

export const placesFromJSON = loadPlacesFromJSON();