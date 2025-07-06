import React from "react";
import { getColorByAQI } from "../utils/getColorByAQI";

const AQICard = ({ data }) => {
  if (!data) return null;
  console.log("AQICard data:", data);

  const {
    city,
    estimated,
    timestamp,
    note,
    advisory,
    aqi: directAQI,
    data: nestedData,
  } = data;

  const aqi = directAQI ?? nestedData?.aqi ?? "N/A";

  /*const parsedDate = timestamp ? new Date(timestamp) : null;*/

  return (
    <div
      className="aqi-card aqi-card-animate"
      style={{
        background: `linear-gradient(120deg, ${getColorByAQI(
          aqi
        )} 80%, #222 100%)`,
        padding: "2rem 1.5rem",
        borderRadius: "1.2rem",
        color: "#111",
        marginTop: "2rem",
        boxShadow: "0 4px 18px 0 rgba(30,60,114,0.18)",
        minWidth: 320,
        maxWidth: 420,
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        overflow: "hidden",
        fontSize: "1.15em",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 22,
          right: 22,
          background: "#fff",
          color: getColorByAQI(aqi),
          fontWeight: 700,
          borderRadius: "999px",
          padding: "0.35em 1.1em",
          fontSize: "1.15em",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          letterSpacing: 1,
        }}
      >
        AQI {aqi}
      </span>

      <h3
        style={{
          margin: "0 0 0.8em 0",
          fontWeight: 700,
          fontSize: "1.7em",
          letterSpacing: 1,
        }}
      >
        {city}
      </h3>

      {estimated && (
        <div
          style={{
            marginBottom: "0.8em",
            fontSize: "0.95em",
            color: "#111",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          Estimated Data (based on nearby stations)
        </div>
      )}

      <div style={{ fontSize: "1.1em", opacity: 0.93, marginBottom: "0.5em" }}>
        <span style={{ fontWeight: 500, color: "#222" }}>Date:</span>{" "}
        <span>
          {timestamp ? new Date(timestamp).toLocaleDateString("en-GB") : "N/A"}
        </span>
      </div>
      <div style={{ fontSize: "1em", opacity: 0.85 }}>
        <span style={{ fontWeight: 500, color: "#222" }}>Time:</span>{" "}
        <span>
          {timestamp
            ? new Date(timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </span>
      </div>

      {note && (
        <p style={{ fontSize: "0.9em", color: "#444", marginTop: "0.8rem" }}>
          <strong>Note:</strong> {note}
        </p>
      )}

      {advisory && (
        <div
          style={{
            marginTop: "1.2rem",
            background: "rgba(255,255,255,0.7)",
            padding: "1rem",
            borderRadius: "1rem",
            fontWeight: 600,
            color: "#111",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Advisory:</strong> {advisory}
          </p>
        </div>
      )}
    </div>
  );
};

export default AQICard;