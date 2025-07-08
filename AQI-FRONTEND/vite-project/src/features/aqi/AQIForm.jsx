import React, { useState, useEffect } from "react";
import {
  fetchAQIByCity,
  fetchEstimateByLocation,
  searchPlaces,
} from "../../services/api";

let debounceTimer;

const AQIForm = ({ onResult, loading, setLoading }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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

  const fetchAndSetAQI = async (name, lat, lon) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchAQIByCity(name);
      if (response?.data?.data) {
        onResult({ ...response.data.data, estimated: false });
        setLoading(false);
        return;
      }

      setError("No official data found. Estimating from nearby stations...");

      const estimateRes = await fetchEstimateByLocation(lat, lon);
      const estimated = estimateRes.data.data;

      onResult({
        ...estimated,
        estimated: true,
        city: name,
        timestamp:
          estimated.timestamp ||
          estimated.nearestStation?.timestamp ||
          new Date().toISOString(),
      });

      setError("");
    } catch (err) {
      console.error("Error fetching AQI:", err);
      setError("No AQI data found for that location.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lng);
    const name = place.name?.split(",")[0]?.trim() || query;

    setQuery(place.name);

    setSuggestions([]);
    fetchAndSetAQI(name, lat, lon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuggestions([]);
    setError("");

    if (!query.trim()) return setError("Please enter a location.");

    try {
      const results = await searchPlaces(query.trim());
      if (results.length === 0) {
        setError("No places found. Try a different name.");
        return;
      }

      const first = results[0];
      handleSelect(first);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Search failed. Try again later.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", position: "relative" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Search for a place in India (e.g. Delhi)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
          style={{
            flex: 1,
            padding: "0.85rem 1.1rem",
            borderRadius: "0.7rem",
            border: "1.5px solid #b2c9e2",
            fontSize: "1.1em",
            outline: "none",
          }}
        />
        {loading && (
          <p style={{ marginTop: "1rem", color: "#444", fontStyle: "italic" }}>
            Fetching estimated AQI data from nearby stations...
          </p>
        )}

        <button type="submit" className="aqi-submit-btn">
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "105%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            listStyle: "none",
            padding: 0,
            marginTop: "0.3rem",
            zIndex: 1000,
            maxHeight: "250px",
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
                transition: "background 0.2s ease",
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
    </div>
  );
};

export default AQIForm;