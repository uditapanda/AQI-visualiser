import { AQI } from "../models/aqi.models.js";


function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; 
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function estimateAQI(rawLat, rawLng, rawRadius = 50) {
  const lat = parseFloat(rawLat);
  const lng = parseFloat(rawLng);
  const radiusKm = parseFloat(rawRadius);

  if (
    isNaN(lat) || isNaN(lng) || isNaN(radiusKm) ||
    lat < -90 || lat > 90 ||
    lng < -180 || lng > 180 ||
    radiusKm <= 0
  ) {
    throw new Error("Invalid coordinates or radius");
  }

  const allAQI = await AQI.find();

  const nearby = allAQI
    .map((record) => {
      const distance = haversine(lat, lng, record.latitude, record.longitude);
      return { ...record.toObject(), distance };
    })
    .filter((d) => d.distance <= radiusKm && d.aqi != null);

  if (nearby.length === 0) return null;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const loc of nearby) {
    const weight = 1 / (loc.distance || 1);
    weightedSum += loc.aqi * weight;
    totalWeight += weight;
  }

  const estimatedAQI = weightedSum / totalWeight;

  const closest = nearby.sort((a, b) => a.distance - b.distance)[0];

  return {
    aqi: Math.round(estimatedAQI),
    nearestStation: {
      city: closest.city,
      station: closest.station,
      distanceKm: closest.distance.toFixed(2),
      timestamp: closest.timestamp,
    }
  };
}

export { estimateAQI, haversine };