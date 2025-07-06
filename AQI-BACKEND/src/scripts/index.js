import { fetchCPCB } from "./fetchCPCB.js";

const fetchAllAQIData = async () => {
  console.log("Starting full AQI data fetch...");

  await fetchCPCB();
  

  console.log("Finished fetching AQI data from all sources.");
};


fetchAllAQIData()

export { fetchAllAQIData };