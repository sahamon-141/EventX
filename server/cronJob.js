const cron = require("node-cron");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

function setupCronJobs() {
  // Run everyday at 8:00 AM server time
  cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running Daily Event Reminder Cron Job...");
    try {
      // Find events that are exactly happening "tomorrow"
      const tomorrowStart = new Date();
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999);

      const upcomingEvents = await Event.find({
        date: { $gte: tomorrowStart, $lt: tomorrowEnd },
        status: "upcoming"
      });

      if (upcomingEvents.length === 0) {
        console.log("No events happening tomorrow.");
        return;
      }

      console.log(`Found ${upcomingEvents.length} event(s) happening tomorrow. Preparing emails...`);

      const transporter = createTransporter();

      for (const event of upcomingEvents) {
        // Find all registrations for this event
        const registrations = await Registration.find({ event: event._id }).populate("user", "name email");

        let sentCount = 0;
        for (const reg of registrations) {
          if (!reg.user || !reg.user.email) continue;
          
          try {
            await transporter.sendMail({
              from: `"EventX" <${process.env.EMAIL_USER}>`,
              to: reg.user.email,
              subject: `Reminder: ${event.title} is Tomorrow! ⏰`,
              html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
                  <h2 style="color: #4f46e5;">Get Ready! 🚀</h2>
                  <p>Hi ${reg.user.name},</p>
                  <p>Just a quick reminder that <strong>${event.title}</strong> is happening tomorrow on ${new Date(event.date).toDateString()}.</p>
                  <p>We can't wait to see you there!</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="font-size: 13px; color: #888;">Log in to your EventX dashboard for more details.</p>
                </div>
              `
            });
            sentCount++;
          } catch (emailErr) {
            console.error(`Failed to send reminder to ${reg.user.email}:`, emailErr);
          }
        }
        console.log(`Sent ${sentCount} reminders for event: ${event.title}`);
      }
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });

  console.log("✅ Automated cron jobs successfully scheduled");
}

module.exports = setupCronJobs;
