import React, { useState, useEffect } from "react";
import HistoryChart from "./HistoryChart";
import { searchPlaces } from "../../services/api";

let debounceTimer;

const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
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

  const handleSelect = (place) => {
    const name = place.name?.split(",")[0]?.trim() || query;
    setQuery(place.name);
    setSuggestions([]);
    setSelectedCity(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuggestions([]);

    if (!query.trim()) return setError("Please enter a place name.");

    try {
      const results = await searchPlaces(query.trim());
      if (results.length === 0) {
        setError("No such place found.");
        return;
      }

      handleSelect(results[0]);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Search failed. Try again later.");
    }
  };

  return (
    <div className="aqi-page" style={{ position: "relative" }}>
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
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
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

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "115px",
            left: "20%",
            right: "20%",
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

      {error && (
        <p style={{ color: "crimson", marginTop: "1rem", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: "2rem" }}>
        {selectedCity && <HistoryChart city={selectedCity} />}
      </div>
    </div>
  );
};

export default HistoryPage;