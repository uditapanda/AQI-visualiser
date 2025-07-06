import React, { useEffect, useState } from "react";
import { fetchHistoryByCity } from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dummyData = [
  { date: "2025-07-01", aqi: 45, pm25: 40, pm10: 50, no2: 25 },
  { date: "2025-07-02", aqi: 38, pm25: 36, pm10: 42, no2: 20 },
  { date: "2025-07-03", aqi: 52, pm25: 50, pm10: 60, no2: 30 },
  { date: "2025-07-04", aqi: 39, pm25: 39, pm10: 47, no2: 31 },
];

const HistoryChart = ({ city = "kolkata" }) => {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) return;

    const fetchData = async () => {
      try {
        setError("");
        const res = await fetchHistoryByCity(city);
        if (res?.data?.length >= 2) {
          setHistoryData(res.data);
        } else {
          setHistoryData(dummyData);
          setError("Not enough real data, showing demo instead.");
        }
      } catch (err) {
        setError("No historical data found for this city.", err);
        setHistoryData(dummyData);
      }
    };

    fetchData();
  }, [city]);

  return (
    <div className="aqi-page">
      {error && (
        <p style={{ color: "orangered", textAlign: "center", marginTop: "1rem" }}>
          {error}
        </p>
      )}

      <h3 style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.4rem" }}>
        AQI History for {city}
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={historyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aqi" stroke="#ff6a88" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="pm25" stroke="#8884d8" />
          <Line type="monotone" dataKey="pm10" stroke="#82ca9d" />
          <Line type="monotone" dataKey="no2" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;