import React, { useState } from "react";
import HistoryChart from "./HistoryChart";

const HistoryPage = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setSelectedCity(city.trim());
    }
  };

  return (
    <div className="aqi-page">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        AQI History
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
      >
        <input
          type="text"
          placeholder="Enter place name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "0.6rem",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "60%",
          }}
        />
        <button className="aqi-submit-btn" type="submit">
          Get History
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        {selectedCity && <HistoryChart city={selectedCity} />}
      </div>
    </div>
  );
};

export default HistoryPage;