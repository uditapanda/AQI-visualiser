import { AQI } from "../models/aqi.models.js";

const getHistoricalAQIByCity = async (city, days = 30) => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const data = await AQI.find({
    city: city.toLowerCase(),
    timestamp: { $gte: sinceDate }
  });

  const grouped = {};

  data.forEach((entry) => {
    const date = entry.timestamp.toISOString().slice(0, 10); 

    if (!grouped[date]) {
      grouped[date] = { aqi: [], pm25: [], pm10: [], no2: [] };
    }

    grouped[date].aqi.push(entry.aqi);
    if (entry.pm25) grouped[date].pm25.push(entry.pm25);
    if (entry.pm10) grouped[date].pm10.push(entry.pm10);
    if (entry.no2) grouped[date].no2.push(entry.no2);
  });

  const dailyAverages = Object.entries(grouped).map(([date, values]) => ({
    date,
    aqi: avg(values.aqi),
    pm25: avg(values.pm25),
    pm10: avg(values.pm10),
    no2: avg(values.no2),
  }));

  dailyAverages.sort((a, b) => new Date(a.date) - new Date(b.date));

  return dailyAverages;
};

const avg = (arr) => {
  if (!arr.length) return null;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
};

export { getHistoricalAQIByCity };