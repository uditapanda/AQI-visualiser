import React, { useState, useEffect } from "react";
import { fetchForecastByCity, searchPlaces } from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

let debounceTimer;

const ForecastPage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const results = await searchPlaces(query.trim());
        setSuggestions(results);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = async (place) => {
    const city = place.name?.split(",")[0]?.trim() || query;
    setQuery(place.name);
    setSuggestions([]);

    try {
      const res = await fetchForecastByCity(city);
      setForecastData(res.data.data);
      setError("");
    } catch (err) {
      setForecastData(null);
      setError(err.response?.data?.message || "Failed to fetch forecast.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuggestions([]);
    setForecastData(null);
    setError("");

    if (!query.trim()) return setError("Please enter a location.");

    try {
      const results = await searchPlaces(query.trim());
      if (results.length === 0) {
        setError("No such place found.");
        return;
      }
      handleSelect(results[0]);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Search failed.");
    }
  };

  return (
    <div className="aqi-page" style={{ position: "relative" }}>
      <h2>Forecast AQI</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.8rem" }}>
        <input
          type="text"
          placeholder="Enter city/village name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
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

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "125px",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            listStyle: "none",
            padding: 0,
            zIndex: 1000,
            maxHeight: "220px",
            overflowY: "auto",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: "0.8rem 1rem",
                borderBottom: "1px solid #f2f2f2",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f8ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {error && <p style={{ color: "crimson", fontWeight: 600 }}>{error}</p>}

      {forecastData && (
        <>
          <div className="aqi-card aqi-card-animate">
            <h3 style={{ marginBottom: "0.8em" }}>Forecast for {query}</h3>
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