import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";


const ForecastChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p style={{ color: "#666", fontStyle: "italic" }}>
      No forecast data available.
    </p>;
  }


  const chartData = data.map((point) => ({
    ...point,
    time: format(new Date(point.timestamp), "HH:mm"),
  }));


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>AQI Forecast</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 500]} />
          <Tooltip
            formatter={(value) => [`AQI: ${value}`, ""]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#007acc"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


const styles = {
  container: {
    margin: "1rem 0",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#333",
  },
};



export default ForecastChart;