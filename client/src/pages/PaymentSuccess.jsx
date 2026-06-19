import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();
  
  const registrationId = location.state?.registrationId;
  const eventTitle = location.state?.eventTitle || "the event";

  useEffect(() => {
    // If someone visits this page directly without state, redirect them away
    if (!registrationId) {
      navigate("/dashboard");
    }
  }, [registrationId, navigate]);

  if (!registrationId) return null;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f", color: "white",
      fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          maxWidth: "480px", width: "100%", padding: "40px",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "24px", textAlign: "center", position: "relative", overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "200px", height: "200px", background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", pointerEvents: "none"
        }} />

        <div style={{
          width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16,185,129,0.15)",
          border: "2px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "32px",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: "28px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "12px", color: "white" }}>
          Registration Confirmed!
        </h1>
        
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
          You have successfully registered for <strong>{eventTitle}</strong>. Your payment was successful and an invoice has been emailed to you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Main Action Group */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <a href={`${API}/registrations/invoice/${registrationId}?token=${localStorage.getItem("token")}`}
               target="_blank" rel="noopener noreferrer"
               style={{
                 textDecoration: "none", padding: "14px", borderRadius: "12px",
                 background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", fontSize: "14px", fontWeight: 500,
                 display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
               }}>
              ↓ Download Invoice
            </a>

            <Link to={`/community/${eventId}`} style={{
              textDecoration: "none", padding: "14px", borderRadius: "12px",
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa", fontSize: "14px", fontWeight: 500,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
            }}>
              View Shareable Badge ✨
            </Link>
          </div>

          <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}`} 
             target="_blank" rel="noopener noreferrer"
             style={{
               textDecoration: "none", padding: "14px", borderRadius: "12px",
               background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
               color: "white", fontSize: "14px", fontWeight: 500,
               display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
             }}>
            📅 Add to Google Calendar
          </a>

          <Link to="/dashboard" style={{
            marginTop: "12px", color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s"
          }}>
            ← Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
