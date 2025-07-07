import React, { useState } from "react";
import AQIForm from "./AQIForm";
import AQICard from "../../components/AQICard";
import Spinner from "../../components/Spinner";

const AQIPage = () => {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="aqi-page">
      <h2>Check Current AQI</h2>
      <AQIForm onResult={setAqiData} setLoading={setLoading} />
      {loading ? <Spinner /> : aqiData && <AQICard data={aqiData} />}
    </div>
  );
};

export default AQIPage;
