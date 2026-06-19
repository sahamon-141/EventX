// 📍 File: event-system/server/routes/certificateRoutes.js

const express = require("express");
const router = express.Router();
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const authMiddleware = require("../middleware/authMiddleware");
const Registration = require("../models/Registration");

// ✅ GENERATE CERTIFICATE (protected)
router.get("/generate/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      user: req.user.id,
      event: eventId,
    })
      .populate("event")
      .populate("user", "name email"); // only fetch name + email, not password

    // Check registration exists
    if (!registration) {
      return res.status(404).json({ message: "No registration found for this event" });
    }

    // Check populated references didn't fail (e.g. deleted user/event)
    if (!registration.event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!registration.user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check event is completed
    if (registration.event.status !== "completed") {
      return res.status(400).json({
        message: "Certificate is only available after the event is completed",
      });
    }

    // Check attendance
    if (!registration.attendance) {
      return res.status(400).json({
        message: "Certificate is only available for users who attended the event",
      });
    }

    const userName = registration.user.name || "Participant";
    const eventName = registration.event.title;
    const eventDate = new Date(registration.event.date).toDateString();

    // ─── Generate ID if not exists ─────────────────────────────────────────────
    if (!registration.certificateId) {
      const crypto = require("crypto");
      registration.certificateId = "EVX-" + crypto.randomBytes(4).toString("hex").toUpperCase();
      registration.certificateGenerated = true;
      await registration.save();
    }

    // ─── Build PDF ─────────────────────────────────────────────────────────────
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([700, 480]);
    const { width, height } = page.getSize();

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const purple = rgb(0.33, 0.29, 0.72);
    const dark = rgb(0.1, 0.1, 0.1);
    const gray = rgb(0.45, 0.45, 0.45);

    // Background border
    page.drawRectangle({
      x: 20, y: 20,
      width: width - 40, height: height - 40,
      borderColor: purple,
      borderWidth: 2,
    });
    page.drawRectangle({
      x: 26, y: 26,
      width: width - 52, height: height - 52,
      borderColor: purple,
      borderWidth: 0.5,
      opacity: 0.4,
    });

    // Title
    page.drawText("Certificate of Participation", {
      x: 110, y: 380,
      size: 28,
      font: boldFont,
      color: purple,
    });

    // Divider
    page.drawLine({
      start: { x: 60, y: 365 },
      end: { x: 640, y: 365 },
      thickness: 1,
      color: purple,
      opacity: 0.3,
    });

    // Body text
    page.drawText("This is to certify that", {
      x: 60, y: 320,
      size: 14,
      font: regularFont,
      color: gray,
    });

    page.drawText(userName, {
      x: 60, y: 285,
      size: 26,
      font: boldFont,
      color: dark,
    });

    page.drawText("has successfully participated in", {
      x: 60, y: 248,
      size: 14,
      font: regularFont,
      color: gray,
    });

    page.drawText(eventName, {
      x: 60, y: 215,
      size: 20,
      font: boldFont,
      color: purple,
    });

    page.drawText(`Event Date: ${eventDate}`, {
      x: 60, y: 165,
      size: 12,
      font: regularFont,
      color: gray,
    });

    page.drawText(`Certificate generated on: ${new Date().toDateString()}`, {
      x: 60, y: 148,
      size: 12,
      font: regularFont,
      color: gray,
    });

    // Print Certificate ID
    page.drawText(`Certificate ID: ${registration.certificateId}`, {
      x: 480, y: 165,
      size: 10,
      font: boldFont,
      color: dark,
    });
    page.drawText(`Verify at: eventx.com/verify/${registration.certificateId}`, {
      x: 480, y: 150,
      size: 9,
      font: regularFont,
      color: gray,
    });

    // Signature line
    page.drawLine({
      start: { x: 60, y: 90 },
      end: { x: 220, y: 90 },
      thickness: 1,
      color: dark,
    });
    page.drawText("Authorized Signature", {
      x: 65, y: 74,
      size: 10,
      font: regularFont,
      color: gray,
    });

    // ─── Send PDF ───────────────────────────────────────────────────────────────
    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${eventId}.pdf`
    );
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET VERIFY CERTIFICATE (Public)
router.get("/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findOne({ certificateId: id })
      .populate("user", "name email")
      .populate("event", "title date category createdBy");

    if (!registration) {
      return res.status(404).json({ message: "Certificate not found or invalid" });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;