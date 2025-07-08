import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        padding: "1.2rem 0",
        background: "linear-gradient(90deg, #2a5298 0%, #1e3c72 100%)",
        color: "#fff",
        textAlign: "center",
        marginTop: "2rem",
        fontWeight: 500,
        letterSpacing: 0.5,
        fontSize: "1.05rem",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      <span>
        Made with <span style={{ color: "#ff6b81", fontSize: "1.2em" }}>♥</span><b></b>
      </span>
      <span style={{ fontSize: "0.95em", opacity: 0.8 }}>
        &copy; {new Date().getFullYear()} AQI Visualizer
      </span>
    </footer>
  );
};

export default Footer;