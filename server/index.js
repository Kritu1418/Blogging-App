// =========================================================
// ## Final Correct index.js for Render Deployment ##
// =========================================================

// STEP 1: dotenv config
import dotenv from "dotenv";
dotenv.config();

// STEP 2: Imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import blogRoute from "./routes/data.js";

// App init
const app = express();

// ======================= CORS FIX =========================
// Render deployment ke liye FRONTEND_URL use karo
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ✅ Vercel frontend domain
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoute);
app.use("/blog", blogRoute);

// Env variables
const PORT = process.env.PORT || 8000;

// IMPORTANT FIX: Render me "MONGODB_URI" set hota hai
const MONGO_URI = process.env.MONGODB_URI;

// =================== Database + Server ====================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected successfully! 🎉");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("!! FAILED TO CONNECT TO DB !!:", err.message);
    process.exit(1);
  });
