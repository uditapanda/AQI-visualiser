import React from "react";
import AQIMap from "./AQIMap";

const MapPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live AQI Map</h2>
      <AQIMap />
    </div>
  );
};

export default MapPage;