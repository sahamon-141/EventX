import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API from "../api";

export default function EventCommunity() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse user info from localstorage to show personalized badge
  const currentUser = JSON.parse(localStorage.getItem("user")) || { name: "Awesome Guest" };

  // 3D Tilt Ticket Badge Hooks (Must be above early returns)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          axios.get(`${API}/events/${eventId}`),
          axios.get(`${API}/registrations/event/${eventId}/attendees`)
        ]);
        setEvent(eventRes.data);
        setAttendees(attendeesRes.data);
      } catch (err) {
        console.error("Failed to load community data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const shareText = `I just registered for ${event?.title}! Join me there. 🚀 #EventX`;
  const shareUrl = window.location.origin + `/register/${eventId}`; // Link back to register

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
       <div style={{ background: "#07070f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading Community...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ background: "#07070f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Event not found.</p>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Shareable Badge Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <h1 style={{ color: "white", fontSize: "36px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "16px" }}>
            You're Going! 🎊
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", marginBottom: "40px" }}>
            Share your digital ticket badge with your network.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
            
            {/* The Badge */}
            <motion.div 
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                padding: "32px",
                width: "360px",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
                transformStyle: "preserve-3d",
                perspective: 1000
              }}
            >
              <div style={{ position: "absolute", top: -80, right: -80, width: 200, height: 200, background: "#7c3aed", filter: "blur(60px)", opacity: 0.4 }} />
              <div style={{ position: "absolute", bottom: -50, left: -50, width: 150, height: 150, background: "#4f46e5", filter: "blur(50px)", opacity: 0.3 }} />
              
              <div style={{ transform: "translateZ(30px)", position: "relative", zIndex: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: "white", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    VIP Entry
                  </div>
                  <div style={{ padding: "4px 8px", background: "white", borderRadius: "4px" }}>
                    {/* Fake barcode */}
                    <svg width="40" height="15" viewBox="0 0 40 15"><path d="M0 0h2v15H0zm4 0h1v15H4zm3 0h3v15H7zm5 0h1v15h-1zm3 0h2v15h-2zm4 0h1v15h-1zm3 0h4v15h-4zm6 0h1v15h-1zm2 0h2v15h-2zm3 0h1v15h-1zm3 0h4v15h-4z" fill="#000"/></svg>
                  </div>
                </div>

                <h2 style={{ color: "white", fontSize: "32px", margin: "16px 0", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", lineHeight: 1.1 }}>
                  {event.title}
                </h2>
                
                <div style={{ width: "100%", height: "1px", background: "initial", backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.2) 50%, transparent 50%)", backgroundSize: "10px 1px", margin: "24px 0" }} />
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "18px", boxShadow: "0 10px 20px rgba(124,58,237,0.3)" }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>{currentUser.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "2px" }}>
                      {new Date(event.date).toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <button onClick={handleTwitterShare} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#000", border: "1px solid rgba(255,255,255,0.2)", padding: "14px 24px", borderRadius: "12px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                Share on X (Twitter)
              </button>
              <button onClick={handleLinkedInShare} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#0a66c2", border: "none", padding: "14px 24px", borderRadius: "12px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                Share on LinkedIn
              </button>
              <button onClick={() => navigate("/dashboard")} style={{ background: "transparent", border: "none", padding: "14px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </motion.div>

        {/* Attendees List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px", marginBottom: "32px" }}>
            <h2 style={{ color: "white", fontSize: "24px", margin: 0 }}>Community</h2>
            <div style={{ color: "#a78bfa", fontSize: "14px", fontWeight: 600 }}>{attendees.length} attending</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
            <AnimatePresence>
              {attendees.map((attendee, index) => (
                <motion.div 
                  key={attendee.id + index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                  }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                    {attendee.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>{attendee.name}</div>
                    {(attendee.organization || attendee.type === "team") && (
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "4px" }}>
                        {attendee.organization || "Team Registration"}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {attendees.length === 0 && (
                 <p style={{ color: "rgba(255,255,255,0.5)", gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>Be the first one to join the community!</p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
