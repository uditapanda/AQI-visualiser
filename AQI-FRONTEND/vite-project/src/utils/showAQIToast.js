import toast from "react-hot-toast";

export function showAQIToast(aqi) {
  let text = "";
  let color = "";

  if (aqi <= 50) {
    text = `Good, breathe easy!`;
    color = "#4caf50";
  } else if (aqi <= 100) {
    text = `Moderate, mostly okay!`;
    color = "#ffeb3b";
  } else if (aqi <= 150) {
    text = `Sensitive, watch out!.`;
    color = "#ff9800";
  } else if (aqi <= 200) {
    text = `Unhealthy, mask up!`;
    color = "#f44336";
  } else if (aqi <= 300) {
    text = `Very Unhealthy, indoors, please.`;
    color = "#9c27b0";
  } else {
    text = `Hazardous. DO NOT GO OUT!!!`;
    color = "#7b1fa2";
  }

  toast(text, {
    icon: "📢",
    duration: 5000,
    style: {
      background: color,
      color: "#111",
      fontWeight: "bold",
      borderRadius: "12px",
      padding: "1rem 1.5rem",
      fontSize: "1rem",
      boxShadow: "0 5px 18px rgba(0,0,0,0.2)",
    },
  });
}