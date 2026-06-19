// 📍 File: event-system/server/index.js


require('dns').setDefaultResultOrder('ipv4first');
// 🌐 Force IPv4 DNS resolution (Render free tier blocks IPv6 outbound)
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

// 📦 Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes         = require("./routes/userRoutes");
const eventRoutes        = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const certificateRoutes  = require("./routes/certificateRoutes");
const emailRoutes        = require("./routes/emailRoutes");
const paymentRoutes      = require("./routes/paymentRoutes");
const authMiddleware     = require("./middleware/authMiddleware");
const setupCronJobs      = require("./cronJob");

// 🚀 App init
const app = express();

// 🛠 Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any localhost port (dev) or the env-configured client URL
    const allowed = process.env.CLIENT_URL || "";
    if (
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
      origin === allowed
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
}));


app.use(express.json());

// 🌐 Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔗 Routes
app.use("/api/users",         userRoutes);
app.use("/api/events",        eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/certificate",   certificateRoutes);
app.use("/api/email",         emailRoutes);
app.use("/api/payments",      paymentRoutes);


// 🔐 Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// ❌ 404 catch-all for unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔌 MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB Connected ✅ (DB: ${mongoose.connection.name})`);
    setupCronJobs();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error ❌:", err.message);
    process.exit(1);
  });