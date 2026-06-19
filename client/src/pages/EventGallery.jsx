import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import API from "../api";

export default function EventGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // We should ideally check if the user is registered to view this gallery.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    
    // First we would check if they have a registration. Since the backend may not have a direct route for just checking registration boolean right now, we can fetch all of their registrations and see if this event is in it.
    axios.get(`${API}/registrations/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const regs = res.data;
        const reg = regs.find(r => r.event?._id === id);
        if (reg) {
          setIsRegistered(true);
          setEventTitle(reg.event.title);
        } else {
          setIsRegistered(false);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ minHeight: "100vh", background: "#07070f", color: "white", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>Loading secure gallery...</div>;

  if (!isRegistered) {
    return (
      <div style={{ minHeight: "100vh", background: "#07070f", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: "64px" }}>🔒</h1>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "40px", marginBottom: "16px" }}>Exclusive Access</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>You must be registered for this event to view its photo gallery.</p>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "12px 24px", borderRadius: "100px", border: "none", background: "white", color: "black", fontWeight: 600, cursor: "pointer" }}>Back to Dashboard</button>
      </div>
    );
  }

  // Dummy gallery data
  const photos = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
    "https://images.unsplash.com/photo-1475721025505-11756598357f?w=800&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "120px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16,185,129,0.1)", borderRadius: "100px", padding: "8px 16px", color: "#10b981", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>
             <span>🔓</span> Secure Attendee Access
          </div>
          <h1 style={{ fontSize: "56px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", margin: "0 0 16px", fontWeight: 400 }}>{eventTitle} Gallery</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>Relive the best moments. You can download and share these high-quality photos with your network.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {photos.map((url, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", cursor: "pointer", position: "relative" }}
            >
               <img src={url} alt={`Event photo ${i}`} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
               <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Photo {i + 1}</span>
                 <button style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "6px 12px", borderRadius: "100px", cursor: "pointer" }}>⬇ Download</button>
               </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
