// 📍 File: event-system/server/routes/userRoutes.js
//
// 📦 Install required package:
//    npm install express-validator

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// ─── Helper: send validation errors ───────────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// ✅ REGISTER
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ✅ LOGIN
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ✅ GET PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE PROFILE
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, organization, avatar, bio, socialLinks, subscriptionPlan } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (organization !== undefined) user.organization = organization;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (socialLinks !== undefined) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (subscriptionPlan !== undefined) user.subscriptionPlan = subscriptionPlan;

    await user.save();
    
    // Don't send back password
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: "Profile updated successfully", user: userObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET ORGANIZER PUBLIC PROFILE
router.get("/organizer/:id", async (req, res) => {
  try {
    const organizer = await User.findById(req.params.id).select("name email organization avatar bio socialLinks");
    if (!organizer) return res.status(404).json({ message: "Organizer not found" });

    const Event = require("../models/Event");
    const events = await Event.find({ createdBy: req.params.id }).sort({ date: 1 });

    res.json({ organizer, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;