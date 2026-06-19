import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import API from "../api";

export default function EventTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ height: "100vh", background: "#07070f", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading schedule...</div>;
  }

  if (!event) {
    return <div style={{ height: "100vh", background: "#07070f", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Event not found.</div>;
  }

  // Dummy Schedule Data
  const scheduleData = [
    { time: "09:00 AM", title: "Registration & Breakfast", description: "Grab your badge and enjoy some premium coffee and pastries before the chaos begins.", location: "Main Lobby" },
    { time: "10:30 AM", title: "Opening Keynote", description: "Our CEO takes the stage to lay out the vision for the future of the industry.", location: "Grand Hall A" },
    { time: "12:00 PM", title: "Networking Lunch", description: "Connect with industry leaders over a fully catered 3-course lunch.", location: "Dining Pavilion" },
    { time: "01:30 PM", title: "Breakout Sessions", description: "Choose between 'Scaling your Startup' or 'The Future of AI'.", location: "Rooms B & C" },
    { time: "03:45 PM", title: "Fireside Chat", description: "An intimate Q&A session with our surprise guest speaker.", location: "Grand Hall A" },
    { time: "05:00 PM", title: "Closing Remarks & Happy Hour", description: "Wrap up the day with open bar and live music.", location: "Rooftop Terrace" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "120px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "60px" }}>
          <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            ← Back to Event
          </button>
          <div style={{ display: "inline-flex", background: "rgba(124,58,237,0.1)", color: "#c4b5fd", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", border: "1px solid rgba(124,58,237,0.3)", marginBottom: "16px" }}>
            Official Itinerary
          </div>
          <h1 style={{ fontSize: "56px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", margin: "0 0 16px", fontWeight: 400 }}>{event.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>The complete schedule of what's happening and where to be.</p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical Line */}
          <div style={{ position: "absolute", left: "24px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(124,58,237,0.1))" }} />

          {scheduleData.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ display: "flex", gap: "32px", marginBottom: "48px", position: "relative" }}
            >
              {/* Timeline Dot */}
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#07070f", border: "4px solid #7c3aed", position: "absolute", left: "17px", top: "6px", zIndex: 2 }} />

              {/* Time Column */}
              <div style={{ marginLeft: "64px", minWidth: "100px" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#a78bfa" }}>{item.time}</span>
              </div>

              {/* Content Column */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "24px", flex: 1 }}>
                <h3 style={{ fontSize: "22px", margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 16px" }}>{item.description}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                   <span>📍</span> {item.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
