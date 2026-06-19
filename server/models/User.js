// 📍 File: models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ""
  },
  organization: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/150?img=11" // Placeholder stock image
  },
  bio: {
    type: String,
    default: ""
  },
  socialLinks: {
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  subscriptionPlan: {
    type: String,
    enum: ["free", "pro", "max"],
    default: "free"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);