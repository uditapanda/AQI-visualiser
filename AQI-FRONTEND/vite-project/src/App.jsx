import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./features/map/MapPage";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import AQIPage from "./features/aqi/AQIPage";
import ForecastPage from "./features/forecast/ForecastPage";
import HistoryPage from "./features/history/HistoryPage";


const App = () => {
  return (
    <Router>
      <Header />

      <main style={{ padding: "1rem", minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<AQIPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;