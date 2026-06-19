import React from "react";
import { motion } from "framer-motion";

export default function Integrations() {
  const integrations = [
    { name: "Slack", desc: "Push event registrations directly to a Slack channel.", icon: "💬", color: "#E01E5A" },
    { name: "Zoom", desc: "Auto-generate Zoom meeting links for virtual events.", icon: "📹", color: "#2D8CFF" },
    { name: "Salesforce", desc: "Sync attendee data seamlessly to your CRM.", icon: "☁️", color: "#00A1E0" },
    { name: "Razorpay", desc: "Accept secure payments directly on checkout.", icon: "💳", color: "#002366" },
    { name: "Google Calendar", desc: "Allow attendees to add events to their calendars instantly.", icon: "📅", color: "#4285F4" },
    { name: "Mailchimp", desc: "Add newly registered users to your email marketing lists.", icon: "📧", color: "#FFE01B" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "140px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(40px, 5vw, 64px)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", margin: "0 0 20px", fontWeight: 400 }}
          >
            Connect your favorite tools.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}
          >
            EventX connects natively with the platforms you already use, allowing you to streamline your entire event management workflow.
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {integrations.map((int, i) => (
            <motion.div
              key={int.name}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "24px",
                padding: "32px",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex", flexDirection: "column", gap: "16px"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = int.color;
                e.currentTarget.style.boxShadow = `0 10px 40px ${int.color}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {int.icon}
                </div>
                <div style={{ fontSize: "14px", color: int.color, fontWeight: 600, background: `${int.color}22`, padding: "4px 12px", borderRadius: "100px" }}>Connect</div>
              </div>
              <h3 style={{ fontSize: "24px", margin: "8px 0 0" }}>{int.name}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>{int.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ marginTop: "80px", textAlign: "center", padding: "60px", background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.05))", borderRadius: "32px", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <h2 style={{ fontSize: "32px", margin: "0 0 16px" }}>Need a custom integration?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>Our Enterprise plan offers API access and dedicated engineering support to build custom workflows.</p>
          <button style={{ padding: "16px 32px", borderRadius: "100px", border: "none", background: "white", color: "black", fontWeight: 600, cursor: "pointer", fontSize: "16px" }}>Contact Sales</button>
        </motion.div>

      </div>
    </div>
  );
}
