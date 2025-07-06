import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import "./cron/index.js"; 
import { fetchAllAQIData } from "./scripts/index.js";


dotenv.config({
  path: './.env'
});


connectDB()
  .then(() => {
    fetchAllAQIData()
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGODB CONNECTION FAILED!!!", err);
  });