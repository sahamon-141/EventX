const mongoose = require("mongoose");
const Registration = require("./models/Registration");
const Event = require("./models/Event");
const User = require("./models/User");
require("dotenv").config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Find ANY user (since we just need someone to register)
    const user = await User.findOne();
    if (!user) {
      console.log("❌ No users found in database. Please register a user or run 'node seedEvents.js' first.");
      process.exit(1);
    }
    console.log(`Found user: ${user.email} (ID: ${user._id})`);

    // 2. Clear existing registrations to avoid duplicates during testing
    await Registration.deleteMany({ user: user._id });
    console.log("Cleared old registrations for Admin user...");

    // 3. Find some events to register for
    const events = await Event.find().limit(5);
    
    if (events.length === 0) {
      console.log("❌ No events found. Please run 'node seedEvents.js' first.");
      process.exit(1);
    }

    // 4. Create registrations
    const registrationData = events.map((event, index) => ({
      user: user._id,
      event: event._id,
      paymentStatus: "paid",
      attendance: index === 0, // Mark first event as attended for testing
      phone: "9876543210",
      organisation: "EventX HQ",
      participationType: "solo",
      registeredAt: new Date()
    }));

    await Registration.insertMany(registrationData);
    console.log(`✅ Successfully created ${registrationData.length} registrations for Admin!`);
    
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seed();
