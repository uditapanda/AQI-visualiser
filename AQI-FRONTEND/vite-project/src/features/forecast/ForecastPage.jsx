import React, { useState } from "react";
import { fetchForecastByCity } from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ForecastPage = () => {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForecastData(null);

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const response = await fetchForecastByCity(city.trim());
      setForecastData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch forecast data.");
    }
  };

  return (
    <div className="aqi-page">
      <h2>Forecast AQI</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.8rem" }}>
        <input
          type="text"
          placeholder="Enter place name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "0.6rem",
            border: "1px solid #ccc",
            fontSize: "1.05rem",
            flex: 1,
          }}
        />
        <button type="submit" className="aqi-submit-btn">
          Get Forecast
        </button>
      </form>

      {error && <p style={{ color: "crimson", fontWeight: 600 }}>{error}</p>}

      {forecastData && (
        <>
          <div className="aqi-card aqi-card-animate">
            <h3 style={{ marginBottom: "0.8em" }}>Forecast for {city}</h3>
            <p><strong>Trend:</strong> {forecastData.trend}</p>
            <p><strong>Method:</strong> {forecastData.method}</p>
            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Based On:</h4>
            <ul>
              {forecastData.basedOn.map((entry, idx) => (
                <li key={idx}>
                  AQI: {entry.aqi}, Time: {new Date(entry.timestamp).toLocaleString("en-GB")}
                </li>
              ))}
            </ul>
          </div>

          <h3 style={{ textAlign: "center", marginTop: "2rem" }}>3-Day AQI Forecast Chart</h3>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={forecastData.forecast}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="predictedAQI"
                stroke="#ff6a88"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default ForecastPage;