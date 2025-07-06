import React, { useState } from "react";
import {
  fetchAQIByCity,
  fetchPlaceByName,
  fetchEstimateByLocation,
} from "../../services/api";
import AQICard from "../../components/AQICard";

const AQIPage = () => {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAqiData(null);

    const cityName = city.trim();
    if (!cityName) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const response = await fetchAQIByCity(cityName);

      if (response && response.data) {
        setAqiData({ ...response.data.data, estimated: false });
      } else {
        console.warn("City not found in AQI DB. Trying fallback estimate.");

        const placeRes = await fetchPlaceByName(cityName);
        const { lat, lng } = placeRes.data;

        const estimateRes = await fetchEstimateByLocation(lat, lng);
        const { data: estimatedAQIData } = estimateRes.data;

        setAqiData({
          ...estimatedAQIData,
          estimated: true,
          city: cityName,
          timestamp:
            estimatedAQIData.timestamp ||
            estimatedAQIData.nearestStation?.timestamp ||
            new Date().toISOString(),
        });

        console.log("AQI Data Set:", {
          ...estimateRes.data,
          estimated: true,
          city: cityName,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("No data found for that location.");
    }
  };

  return (
    <div className="aqi-page">
      <h2>Check Current AQI</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter place name (eg, Delhi)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "0.6rem",
            border: "1px solid #ccc",
            marginRight: "0.8rem",
            fontSize: "1.05rem",
          }}
        />
        <button type="submit" className="aqi-submit-btn">
          Get AQI
        </button>
      </form>

      {error && <p style={{ color: "crimson", fontWeight: 600 }}>{error}</p>}

      {aqiData && <AQICard data={aqiData} />}
    </div>
  );
};

export default AQIPage;