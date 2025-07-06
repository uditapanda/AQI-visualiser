import cron from "node-cron";
import { fetchCPCB } from "../scripts/fetchCPCB.js";

console.log("Cron job initialized...");

cron.schedule("*/30 * * * *", async () => {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log(`Cron triggered at ${now} – Running CPCB fetch job...`);
  await fetchCPCB();
});

console.log("Cron job scheduled to run every 30 minutes.");