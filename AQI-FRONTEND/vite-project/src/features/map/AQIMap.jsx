import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Spinner from "../../components/Spinner";
import { showAQIToast } from "../../utils/showAQIToast";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const getColorByAQI = (aqi) => {
  if (aqi <= 50) return "#4caf50";
  if (aqi <= 100) return "#ffeb3b";
  if (aqi <= 200) return "#ff9800";
  if (aqi <= 300) return "#f44336";
  return "#880e4f";
};

const AQIMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const addAQIMarker = (map, coords, placeName, finalAQI, advisory) => {
    if (markerRef.current) markerRef.current.remove();

    const el = document.createElement("div");
    el.className = "aqi-marker";
    el.style.backgroundColor = getColorByAQI(finalAQI);
    el.style.width = "28px";
    el.style.height = "28px";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid white";
    el.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
    el.style.cursor = "pointer";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.color = "white";
    el.style.fontWeight = "bold";
    el.style.fontSize = "12px";
    el.textContent = finalAQI;

    const popupContent = `
      <strong>${placeName}</strong><br/>
      AQI: ${finalAQI}<br/>
      ${advisory ? `<em>${advisory}</em>` : ""}
    `;

    const newMarker = new mapboxgl.Marker(el)
      .setLngLat(coords)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
      .addTo(map)
      .togglePopup();

    markerRef.current = newMarker;
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [80.9, 23.5],
      zoom: 4.5,
    });

    map.getCanvas().style.cursor = "crosshair";

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      placeholder: "Search for a location",
      marker: false,
    });

    map.addControl(geocoder);

    map.on("load", async () => {
      try {
        const response = await fetch("http://localhost:8000/heatmap_dump.json");
        const geojson = await response.json();

        map.addSource("heatmap", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "heatmap-layer",
          type: "heatmap",
          source: "heatmap",
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "aqi"],
              0,
              0,
              500,
              1,
            ],
            "heatmap-intensity": 1.2,
            "heatmap-radius": 18,
            "heatmap-opacity": 0.8,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0,0,0,0)",
              0.2,
              "#4caf50",
              0.4,
              "#ffeb3b",
              0.6,
              "#ff9800",
              0.8,
              "#f44336",
              1,
              "#880e4f",
            ],
          },
        });

        console.log("Heatmap loaded!");
      } catch (err) {
        console.error("Failed to load heatmap_dump.json:", err);
      }
    });

    const fetchEstimatedAQI = async (lat, lng, placeName) => {
      setLoadingEstimate(true);
      try {
        const city = placeName?.split(",")[0]?.trim() || "Unknown";
        console.log("Trying to fetch official AQI for:", city);

        const officialRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/aqi/latest/${city}`
        );
        const officialData = await officialRes.json();

        if (officialRes.ok && officialData?.data) {
          const { aqi, advisory } = officialData.data;
          const finalAQI = aqi ?? "N/A";

          map.flyTo({ center: [lng, lat], zoom: 10 });
          addAQIMarker(map, [lng, lat], placeName, finalAQI, advisory);
          if (aqi != null) showAQIToast(aqi);
          return;
        }

        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/aqi/estimate?lat=${lat}&lng=${lng}`
        );
        if (!res.ok) throw new Error("Estimation failed");

        const data = await res.json();
        const { aqi, advisory } = data.data;
        const finalAQI = aqi ?? "N/A";

        map.flyTo({ center: [lng, lat], zoom: 10 });
        addAQIMarker(map, [lng, lat], placeName, finalAQI, advisory);
        if (aqi != null) showAQIToast(aqi);
      } catch (err) {
        console.error("Failed to fetch AQI:", err);
        alert("Could not fetch AQI for this location!");
      } finally {
        setLoadingEstimate(false);
      }
    };

    geocoder.on("result", (e) => {
      const coords = e.result.center;
      const placeName = e.result.place_name;
      fetchEstimatedAQI(coords[1], coords[0], placeName);
    });

    map.on("click", (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      fetchEstimatedAQI(lat, lng, "Dropped Location");
    });

    return () => map.remove();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {loadingEstimate && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 999,
            transform: "translate(-50%, -50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Spinner />
        </div>
      )}

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default AQIMap;
