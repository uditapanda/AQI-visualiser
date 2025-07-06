import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; 

const Header = () => {
  return (
    <header
      style={{
        padding: "1rem 2rem",
        background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="AQI Logo"
          style={{
            width: 36,
            height: 36,
            objectFit: "contain",
            borderRadius: "50%",
            marginRight: 16,
            background: "rgba(255,255,255,0.15)",
            padding: 4,
          }}
        />
        <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700, letterSpacing: 1 }}>
          AQI Visualizer
        </h1>
      </div>
      <nav>
        <Link to="/" style={{ color: "#b2ffb2", marginRight: "1.5rem", fontWeight: 500, textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/forecast" style={{ color: "#b2ffb2", marginRight: "1.5rem", fontWeight: 500, textDecoration: "none" }}>
          Forecast
        </Link>
        <Link to="/history" style={{ color: "#b2ffb2", marginRight: "1.5rem", fontWeight: 500, textDecoration: "none" }}>
          History
        </Link>
        <Link to="/map" style={{ color: "#b2ffb2", fontWeight: 500, textDecoration: "none" }}>
          Map
        </Link>
      </nav>
    </header>
  );
};

export default Header;