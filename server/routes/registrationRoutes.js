// 📍 File: event-system/server/routes/registrationRoutes.js

const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const nodemailer = require("nodemailer");

// ─── Reusable transporter ──────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,  // Force IPv4 — Render free tier doesn't support IPv6
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ─── Helper: Generate Invoice PDF ──────────────────────────────────────────────
async function generateInvoice(registration, event, user) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 750]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const purple = rgb(0.48, 0.22, 0.92);

  const drawText = (t, s, x, y, f = font, c = rgb(0,0,0)) => 
    page.drawText(t, { x, y, size: s, font: f, color: c });

  // Header
  drawText("EventX", 28, 50, height - 70, boldFont, purple);
  drawText("INVOICE / RECEIPT", 20, width - 250, height - 70, boldFont, rgb(0.4, 0.4, 0.4));
  
  page.drawLine({ start: { x: 50, y: height - 90 }, end: { x: width - 50, y: height - 90 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

  // Details
  drawText(`Receipt ID: ${registration.paymentId || "Free Registration"}`, 12, width - 250, height - 120, boldFont);
  drawText(`Date: ${new Date(registration.registeredAt).toLocaleDateString()}`, 12, width - 250, height - 140);
  
  drawText("Billed To:", 12, 50, height - 120, boldFont);
  drawText(user.name, 12, 50, height - 140);
  drawText(user.email, 12, 50, height - 160);
  if (registration.organisation) drawText(registration.organisation, 12, 50, height - 180);

  // Table
  const tableY = height - 250;
  page.drawRectangle({ x: 50, y: tableY - 10, width: width - 100, height: 30, color: rgb(0.95, 0.95, 0.95) });
  drawText("Item / Description", 12, 60, tableY, boldFont);
  drawText("Amount", 12, width - 120, tableY, boldFont);

  drawText(`Registration for: ${event.title}`, 12, 60, tableY - 40);
  drawText(registration.participationType === "team" ? `Team: ${registration.teamName}` : "Solo Participation", 10, 60, tableY - 55, font, rgb(0.4, 0.4, 0.4));
  
  const priceText = event.price > 0 ? `INR ${event.price}` : "FREE";
  drawText(priceText, 12, width - 120, tableY - 40);

  page.drawLine({ start: { x: 50, y: tableY - 80 }, end: { x: width - 50, y: tableY - 80 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  drawText("Total Paid:", 12, width - 200, tableY - 110, boldFont);
  drawText(priceText, 14, width - 120, tableY - 110, boldFont, purple);

  // Footer
  drawText("Thank you for registering!", 14, 50, 100, boldFont, purple);
  drawText("If you have any questions, contact support at hello@eventx.com", 10, 50, 80, font, rgb(0.5, 0.5, 0.5));

  return await pdfDoc.save();
}

// ─── Helper: Generate Certificate PDF ──────────────────────────────────────────
async function generateCertificatePDF(userName, eventName, dateString) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([700, 480]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const purple = rgb(0.33, 0.29, 0.72);
  const dark = rgb(0.1, 0.1, 0.1);
  const gray = rgb(0.45, 0.45, 0.45);

  page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: purple, borderWidth: 2 });
  page.drawRectangle({ x: 26, y: 26, width: width - 52, height: height - 52, borderColor: purple, borderWidth: 0.5, opacity: 0.4 });

  page.drawText("Certificate of Participation", { x: 110, y: 380, size: 28, font: boldFont, color: purple });
  page.drawLine({ start: { x: 60, y: 365 }, end: { x: 640, y: 365 }, thickness: 1, color: purple, opacity: 0.3 });

  page.drawText("This is to certify that", { x: 60, y: 320, size: 14, font: regularFont, color: gray });
  page.drawText(userName, { x: 60, y: 285, size: 26, font: boldFont, color: dark });
  page.drawText("has successfully participated in", { x: 60, y: 248, size: 14, font: regularFont, color: gray });
  page.drawText(eventName, { x: 60, y: 215, size: 20, font: boldFont, color: purple });

  page.drawText(`Event Date: ${dateString}`, { x: 60, y: 165, size: 12, font: regularFont, color: gray });
  page.drawText(`Certificate generated on: ${new Date().toDateString()}`, { x: 60, y: 148, size: 12, font: regularFont, color: gray });

  page.drawLine({ start: { x: 60, y: 90 }, end: { x: 220, y: 90 }, thickness: 1, color: dark });
  page.drawText("Authorized Signature", { x: 65, y: 74, size: 10, font: regularFont, color: gray });

  return await pdfDoc.save();
}

// ✅ REGISTER FOR AN EVENT (protected)
router.post("/register/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { phone, organisation, teamName, teamMembers, participationType, notes, paymentId } = req.body;

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Prevent registering for completed events
    if (event.status === "completed") {
      return res.status(400).json({ message: "This event has already completed" });
    }

    // Prevent duplicate registration
    const existing = await Registration.findOne({ user: req.user.id, event: eventId });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // Check capacity
    const count = await Registration.countDocuments({ event: eventId });
    if (count >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration with extra fields
    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      paymentStatus: event.price > 0 ? "paid" : "paid", // Assumed paid if reached here
      paymentId: paymentId || "",
      phone: phone || "",
      organisation: organisation || "",
      teamName: teamName || "",
      teamMembers: Array.isArray(teamMembers) ? teamMembers.filter(m => m.trim()) : [],
      participationType: participationType || "solo",
      notes: notes || "",
    });

    await registration.save();

    // Send response immediately so the UI doesn't hang
    res.status(201).json({ message: "Registered successfully", registration });

    // Fire email in the background (non-blocking)
    (async () => {
      try {
        const invoiceBuffer = await generateInvoice(registration, event, { name: req.user.name || "Participant", email: req.user.email });
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"EventX" <${process.env.EMAIL_USER}>`,
          to: req.user.email,
          subject: `Registration Confirmed – ${event.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
              <h2 style="color: #6d28d9;">You're in! 🎉</h2>
              <p>Hi,</p>
              <p>Your registration for <strong>${event.title}</strong> is fully confirmed.</p>
              <p>You will find your invoice attached to this email.</p>
              <p style="margin-top: 24px; color: #888; font-size: 13px;">
                You can also view this securely from your EventX Dashboard.
              </p>
            </div>
          `,
          attachments: invoiceBuffer ? [
            {
              filename: `Invoice_${event.title.replace(/\s+/g,"_")}.pdf`,
              content: Buffer.from(invoiceBuffer),
              contentType: "application/pdf"
            }
          ] : []
        });
        console.log("Confirmation email sent for:", event.title);
      } catch (bgErr) {
        console.error("Background email error:", bgErr.message);
      }
    })();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DOWNLOAD INVOICE (protected)
router.get("/invoice/:registrationId", authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.registrationId).populate("event").populate("user", "name email");
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (reg.user._id.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    const invoiceBuffer = await generateInvoice(reg, reg.event, reg.user);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Invoice_${reg.event.title.replace(/\s+/g, "_")}.pdf`);
    res.send(Buffer.from(invoiceBuffer));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET MY REGISTRATIONS (protected)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event")
      .sort({ registeredAt: -1 });

    res.json(registrations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET REGISTRATION COUNT FOR AN EVENT (public — useful for capacity display)
router.get("/count/:eventId", async (req, res) => {
  try {
    const count = await Registration.countDocuments({ event: req.params.eventId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET EVENT ATTENDEES (public — useful for community page)
router.get("/event/:eventId/attendees", async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "name organization");
      
    // Transform to show only necessary public info
    const attendees = registrations.map(reg => ({
      id: reg.user ? reg.user._id : Math.random().toString(),
      name: reg.participationType === "team" ? reg.teamName : (reg.user ? reg.user.name : "Anonymous"),
      organization: reg.organization || (reg.user ? reg.user.organization : ""),
      type: reg.participationType
    }));

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ MARK ATTENDANCE (protected — user marks their own attendance)
router.patch("/:registrationId/attendance", authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId).populate("user").populate("event");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Only the registered user can mark their own attendance
    if (registration.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (registration.attendance) {
       return res.status(400).json({ message: "Attendance is already marked" });
    }

    registration.attendance = true;
    await registration.save();

    // Respond immediately
    res.json({ message: "Attendance marked and certificate emailed successfully", registration });

    // Fire certificate email in the background (non-blocking)
    const userName = registration.user.name || "Participant";
    const eventName = registration.event.title;
    const eventDate = new Date(registration.event.date).toDateString();

    (async () => {
      try {
        const certBuffer = await generateCertificatePDF(userName, eventName, eventDate);
        if (certBuffer) {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: `"EventX" <${process.env.EMAIL_USER}>`,
            to: registration.user.email,
            subject: `Your Certificate – ${eventName}`,
            html: `
              <div style="font-family: sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
                <h2 style="color: #6d28d9;">Congratulations, ${userName}! 🎓</h2>
                <p>Your attendance for <strong>${eventName}</strong> has been successfully verified.</p>
                <p>Please find your official Certificate of Participation attached to this email.</p>
                <p style="margin-top: 24px; color: #888; font-size: 13px;">
                  You can also view and download this securely from your EventX Dashboard.
                </p>
              </div>
            `,
            attachments: [
              {
                filename: `Certificate_${eventName.replace(/\s+/g,"_")}.pdf`,
                content: Buffer.from(certBuffer),
                contentType: "application/pdf"
              }
            ]
          });
          console.log("Certificate email sent for:", eventName);
        }
      } catch (bgErr) {
        console.error("Background certificate email error:", bgErr.message);
      }
    })();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;