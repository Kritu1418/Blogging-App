// =========================================================
// ## Final Correct index.js Code ##
// =========================================================

// STEP 1: DOTENV ko sabse pehle configure karo
import dotenv from "dotenv";
dotenv.config();

// STEP 2: Baaki sab kuch import karo
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import blogRoute from "./routes/data.js";

// App declare karo
const app = express();

// Middlewares use karo
// ## FINAL FIX YAHAN HAI ## - Ye CORS error ko theek karega
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes use karo
app.use('/auth', authRoute);
app.use('/blog', blogRoute);

// Variables define karo
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Database se connect karo aur server start karo
mongoose.connect(MONGO_URI)
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
