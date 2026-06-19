const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  // Payment & Attendance
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  attendance: {
    type: Boolean,
    default: false,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },

  // 🔥 Extra registration form fields (all optional)
  phone: {
    type: String,
    default: "",
  },
  organisation: {
    type: String,
    default: "",
  },
  teamName: {
    type: String,
    default: "",
  },
  teamMembers: {
    type: [String],
    default: [],
  },
  participationType: {
    type: String,
    enum: ["solo", "team"],
    default: "solo",
  },
  notes: {
    type: String,
    default: "",
  },

  // 🔥 Certificate tracking
  certificateId: {
    type: String,
    default: null
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Registration", registrationSchema);