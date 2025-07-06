import axios from "axios";
import { AQI } from "../models/aqi.models.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const fetchCPCB = async () => {
  try {
    const apiKey = process.env.CPCB_API_KEY;
    if (!apiKey) {
      throw new Error("CPCB API key is missing in .env");
    }

    const resourceId = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69";
    const url = `https://api.data.gov.in/resource/${resourceId}`;

    const response = await axios.get(url, {
      params: {
        "api-key": apiKey,
        format: "json",
        limit: 10000,
      },
    });

    const records = response.data.records || [];
    const stationMap = new Map();

    for (const entry of records) {
      const stationKey = `${entry.station}_${entry.latitude}_${entry.longitude}`;

      if (!stationMap.has(stationKey)) {
        const [date, time] = entry.last_update.split(" ");
        const [day, month, year] = date.split("-");
        const isoString = `${year}-${month}-${day}T${time}`;
        const parsedTimestamp = new Date(isoString);

        stationMap.set(stationKey, {
          city: (entry.city || "Unknown").trim().toLowerCase(),
          station: entry.station?.trim().toLowerCase() || null,
          latitude: parseFloat(entry.latitude),
          longitude: parseFloat(entry.longitude),
          aqi: null,
          pm25: null,
          pm10: null,
          no2: null,
          o3: null,
          co: null,
          so2: null,
          timestamp: parsedTimestamp,
        });
      }

      const stationData = stationMap.get(stationKey);
      const param = entry.pollutant_id?.toLowerCase();
      const value = parseFloat(entry.avg_value);

      if (isNaN(value)) {
        console.warn(
          `Skipping invalid avg_value for ${param} at ${entry.station}, ${entry.city} — got "${entry.avg_value}"`
        );
        continue;
      }

      if (param === "pm2.5" || param === "pm25") stationData.pm25 = value;
      else if (param === "pm10") stationData.pm10 = value;
      else if (param === "no2") stationData.no2 = value;
      else if (param === "o3") stationData.o3 = value;
      else if (param === "co") stationData.co = value;
      else if (param === "so2") stationData.so2 = value;
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const station of stationMap.values()) {
      const hasAnyPollutant =
        station.pm25 !== null ||
        station.pm10 !== null ||
        station.no2 !== null ||
        station.o3 !== null ||
        station.co !== null ||
        station.so2 !== null;

      if (!hasAnyPollutant) {
        console.log(
          `Skipping ${station.city} (${station.station || "unknown station"}): no pollutant data`
        );
        skippedCount++;
        continue;
      }

      station.aqi =
        station.pm25 ??
        station.pm10 ??
        station.no2 ??
        station.o3 ??
        station.co ??
        station.so2 ??
        null;

      const before = new Date(station.timestamp.getTime() - 2 * 60 * 1000);
      const after = new Date(station.timestamp.getTime() + 2 * 60 * 1000);

      const possibleDuplicates = await AQI.find({
        city: station.city,
        latitude: station.latitude,
        longitude: station.longitude,
        timestamp: { $gte: before, $lte: after },
      });

      const isTrulyDuplicate = possibleDuplicates.some((existing) => {
        return (
          existing.pm25 === station.pm25 &&
          existing.pm10 === station.pm10 &&
          existing.no2 === station.no2 &&
          existing.o3 === station.o3 &&
          existing.co === station.co &&
          existing.so2 === station.so2
        );
      });

      if (isTrulyDuplicate) {
        console.log(
          `Skipped strict duplicate for ${station.city} (${station.station}) at ${station.timestamp.toISOString()}`
        );
        skippedCount++;
        continue;
      }

      await AQI.create(station);
      console.log(
        `Inserted AQI for ${station.city} (${station.station || "unknown station"})`
      );
      insertedCount++;
    }

    console.log(`\n Done. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    console.error("Error fetching CPCB data:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
  }
};

export { fetchCPCB };