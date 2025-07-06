import React, { useState } from "react";

const AQIForm = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city.trim());
    setCity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.7rem",
        margin: "2.5rem auto 0 auto",
        padding: "1.2rem 1.5rem",
        background: "linear-gradient(120deg, #fbc2eb 80%, #fcb69f 100%)",
        borderRadius: "1.2rem",
        boxShadow: "0 4px 18px 0 rgba(30,60,114,0.13)",
        maxWidth: 420,
        minWidth: 320,
      }}
    >
      <input
        type="text"
        value={city}
        placeholder="Enter city name (example, Delhi)"
        onChange={(e) => setCity(e.target.value)}
        style={{
          flex: 1,
          padding: "0.85rem 1.1rem",
          borderRadius: "0.7rem",
          border: "1.5px solid #b2c9e2",
          fontSize: "1.13em",
          outline: "none",
          boxShadow: "0 1px 6px 0 rgba(30,60,114,0.07)",
        }}
      />
      <button type="submit" className="aqi-submit-btn">
        Check AQI
      </button>
    </form>
  );
};

export default AQIForm;