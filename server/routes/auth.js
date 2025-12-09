import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Usermodel from "../model/user.js";

import { body, validationResult } from "express-validator";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= REGISTER =================
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isStrongPassword().withMessage("Use a strong Password"),
    body("confirmedPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const existingUser = await Usermodel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email Already Exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new Usermodel({ email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const url = `${process.env.FRONTEND_URL}/verify/${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        to: user.email,
        subject: "Verify Email",
        html: `Click <a href="${url}">here</a> to verify your email.`,
      });

      res.status(201).json({ message: "User Created, Verify Email Now" });

    } catch (error) {
      console.error("Error in /register route:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ================= FORGOT PASSWORD =================
router.post("/forgot", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email Not Found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Reset Password",
      html: `Reset your password here: <a href="${url}">Reset</a>`,
    });

    res.status(200).json({ message: "Reset Link Sent" });

  } catch (error) {
    console.error("Error in /forgot route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ================= VERIFY EMAIL =================
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Usermodel.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid Token" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Verified", redirect: "/login" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await Usermodel.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email Not Found" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email Not Verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password Does Not Match" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login Successful", redirect: "/home" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset/:token", async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usermodel.findById(userId);

    if (!user) return res.status(400).json({ message: "Invalid Token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password Updated", redirect: "/login" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= PROTECTED ROUTE =================
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "This protected route", user: req.user });
});

export default router;
