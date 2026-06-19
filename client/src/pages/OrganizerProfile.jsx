import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrganizerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/organizer/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrganizer(data.organizer);
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07070f", color: "white" }}>Loading...</div>;
  if (!organizer) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07070f", color: "white" }}>Organizer not found</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "100px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)", borderRadius: "32px", padding: "48px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap", backdropFilter: "blur(20px)" }}
        >
          <img 
            src={organizer.avatar || "https://i.pravatar.cc/150?img=11"} 
            alt={organizer.name} 
            style={{ width: "160px", height: "160px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(124,58,237,0.5)", padding: "4px" }}
          />
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h1 style={{ fontSize: "40px", margin: "0 0 8px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}>{organizer.name}</h1>
            <p style={{ color: "#a78bfa", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, margin: "0 0 16px" }}>{organizer.organization || "Independent Creator"}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: 1.6, maxWidth: "500px", margin: "0 0 24px" }}>
              {organizer.bio || "This organizer hasn't written a bio yet, but they host some amazing events!"}
            </p>
            
            <div style={{ display: "flex", gap: "16px" }}>
              {organizer.socialLinks?.twitter && (
                 <a href={organizer.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ color: "white", padding: "8px 16px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", textDecoration: "none", fontSize: "14px" }}>Twitter</a>
              )}
              {organizer.socialLinks?.linkedin && (
                 <a href={organizer.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: "white", padding: "8px 16px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", textDecoration: "none", fontSize: "14px" }}>LinkedIn</a>
              )}
              {organizer.socialLinks?.website && (
                 <a href={organizer.socialLinks.website} target="_blank" rel="noreferrer" style={{ color: "white", padding: "8px 16px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", textDecoration: "none", fontSize: "14px" }}>Website</a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Organizer's Events */}
        <h2 style={{ fontSize: "28px", marginTop: "60px", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>Hosted Events</h2>
        
        {events.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)" }}>This organizer hasn't hosted any events yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/events/${event._id}`)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "24px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "background 0.3s"
                }}
                whileHover={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", background: "rgba(124,58,237,0.2)", color: "#c4b5fd", padding: "4px 10px", borderRadius: "100px" }}>{event.category}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: "20px", margin: "0 0 8px" }}>{event.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: "0 0 16px" }}>
                  {event.description?.substring(0, 80)}...
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                   <span style={{ fontWeight: 600 }}>{event.price === 0 ? "Free" : `$${event.price}`}</span>
                   <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: 500 }}>View Details →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
