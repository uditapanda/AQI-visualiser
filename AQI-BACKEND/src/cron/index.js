import cron from "node-cron";
import { fetchCPCB } from "../scripts/fetchCPCB.js";
import { exec } from "child_process";

console.log("Cron job initialized...");

cron.schedule("*/30 * * * *", async () => {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log(`Cron triggered at ${now} – Running CPCB fetch job...`);
  await fetchCPCB();
});


cron.schedule("0 0 * * *", () => {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log(`[${now}] Running daily heatmap estimation job...`);

  exec("node scripts/generateHeatmapData.js", (err, stdout, stderr) => {
    if (err) {
      console.error("Heatmap cron failed:", err);
    } else {
      console.log("Heatmap cron success:\n", stdout);
    }
  });
});

console.log("Cron jobs scheduled successfully.");