import fs from "fs";

//India's approx boundaries
const minLat = 6.0;
const maxLat = 36.0;
const minLng = 68.0;
const maxLng = 97.0;

const step = 0.5;

const gridPoints = [];

for (let lat = minLat; lat <= maxLat; lat += step) {
  for (let lng = minLng; lng <= maxLng; lng += step) {
    gridPoints.push({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) });
  }
}

fs.writeFileSync("scripts/india_grid.json", JSON.stringify(gridPoints, null, 2));
console.log(`Generated ${gridPoints.length} grid points for India.`);