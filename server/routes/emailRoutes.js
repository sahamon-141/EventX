
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/authMiddleware");

// ─── Reusable transporter ──────────────────────────────────────────────────────
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

// ✅ SEND REGISTRATION CONFIRMATION EMAIL (protected)
// Call this after a user registers for an event
router.post("/send-confirmation", authMiddleware, async (req, res) => {
  try {
    const { toEmail, userName, eventName, eventDate } = req.body;

    if (!toEmail || !userName || !eventName) {
      return res.status(400).json({ message: "toEmail, userName, and eventName are required" });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"EventX" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Registration Confirmed – ${eventName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #534AB7;">You're registered! 🎉</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your registration for <strong>${eventName}</strong> is confirmed.</p>
          ${eventDate ? `<p>📅 <strong>Date:</strong> ${eventDate}</p>` : ""}
          <p style="margin-top: 24px; color: #888; font-size: 13px;">
            You can download your certificate from the Dashboard once the event is completed and attendance is marked.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #aaa; font-size: 12px;">EventX – Smart Event & Certificate Management</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Confirmation email sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

// ✅ SEND GENERIC EMAIL (protected — for testing or admin use)
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ message: "to, subject, and message are required" });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"EventX" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });

    res.json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

module.exports = router;