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

  exec("node src/scripts/generateHeatmapData.js", (err, stdout, stderr) => {
    if (err) {
      console.error("Heatmap cron failed:", err);
    } else {
      console.log("Heatmap cron success:\n", stdout);

      exec(
        "node src/scripts/deleteOldHeatmapPoints.js",
        (err2, stdout2, stderr2) => {
          if (err2) {
            console.error("Old heatmap deletion failed:", err2);
          } else {
            console.log("Old heatmap deletion success:\n", stdout2);

            exec(
              "node src/scripts/updateHeatmapDump.js",
              (err3, stdout3, stderr3) => {
                if (err3) {
                  console.error("Heatmap dump update failed:", err3);
                } else {
                  console.log("Heatmap dump updated:\n", stdout3);
                }
              }
            );
          }
        }
      );
    }
  });
});

console.log("Cron jobs scheduled successfully.");