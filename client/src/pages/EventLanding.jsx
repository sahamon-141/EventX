import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import API from "../api";

export default function EventLanding() {
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
    return <div style={{ height: "100vh", background: "#07070f", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading event details...</div>;
  }

  if (!event) {
    return <div style={{ height: "100vh", background: "#07070f", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Event not found.</div>;
  }

  const isPaid = event.price > 0;
  const eventDate = new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const eventTime = new Date(event.date).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  const dummySpeakers = event.speakers?.length > 0 ? event.speakers : [
    { name: "John Doe", company: "CEO, InnovateTech", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Jane Smith", company: "VP Product", image: "https://i.pravatar.cc/150?img=47" },
    { name: "Alex Chen", company: "Lead Developer", image: "https://i.pravatar.cc/150?img=33" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Hero Section */}
      <div style={{ position: "relative", padding: "160px 24px 100px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        
        {/* Abstract Background */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
          {event.galleryImages && event.galleryImages.length > 0 ? (
            <img src={event.galleryImages[0]} alt="Event Background" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px) brightness(0.4)" }} />
          ) : (
            <div style={{ position: "absolute", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)", top: "-200px", left: "50%", transform: "translateX(-50%)" }} />
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: "900px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.2)", color: "#c4b5fd", padding: "8px 16px", borderRadius: "100px", fontSize: "14px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "24px", border: "1px solid rgba(124,58,237,0.3)" }}>
            {event.category} Event
          </div>
          <h1 style={{ fontSize: "clamp(48px, 6vw, 84px)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, margin: "0 0 24px", lineHeight: 1.1 }}>
            {event.title}
          </h1>
          <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.6)", maxWidth: "700px", margin: "0 auto 40px", lineHeight: 1.5 }}>
            {event.description?.substring(0, 150) || "Join us for an incredible experience that will transform the way you think about the future."}...
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/register/${event._id}`)}
              style={{ padding: "18px 40px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", fontSize: "18px", fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 30px rgba(124,58,237,0.4)" }}
            >
              Get Tickets {isPaid ? `(₹${event.price})` : "(Free)"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Main Content Split */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px", display: "grid", gridTemplateColumns: "1fr 350px", gap: "60px", alignItems: "start" }}>
        
        {/* Left Column: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
          
          {/* About */}
          <section>
            <h2 style={{ fontSize: "32px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "24px" }}>About the event</h2>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              {event.description || "This event does not have an extended description. However, you can expect an engaging, well-organized experience crafted by our premium organizers. Network with industry professionals and gain valuable insights."}
            </p>
          </section>

          {/* Speakers */}
          <section>
            <h2 style={{ fontSize: "32px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "32px" }}>Featured Speakers</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              {dummySpeakers.map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                  <img src={s.image} alt={s.name} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px", border: "2px solid #7c3aed" }} />
                  <h3 style={{ fontSize: "18px", margin: "0 0 8px" }}>{s.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>{s.company}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery placeholder */}
          <section>
             <h2 style={{ fontSize: "32px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "32px" }}>Gallery Insights</h2>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
               <div style={{ height: "250px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80" alt="Audience" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
               </div>
               <div style={{ height: "250px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&q=80" alt="Tech Setup" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
               </div>
             </div>
          </section>

          {/* Sponsors */}
          <section>
            <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Sponsored By</h2>
            <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap", opacity: 0.5 }}>
               <h3 style={{ fontSize: "28px", margin: 0, fontFamily: "sans-serif", fontWeight: 900 }}>Vercel</h3>
               <h3 style={{ fontSize: "28px", margin: 0, fontFamily: "serif", fontWeight: 700 }}>Notion</h3>
               <h3 style={{ fontSize: "28px", margin: 0, fontFamily: "sans-serif", fontWeight: 700, fontStyle: "italic" }}>Stripe</h3>
               <h3 style={{ fontSize: "28px", margin: 0, fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>Figma</h3>
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Sidebar */}
        <div style={{ position: "sticky", top: "120px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Date & Time</div>
              <div style={{ fontSize: "16px", fontWeight: 500 }}>{eventDate}</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>{eventTime}</div>
              <button 
                onClick={() => navigate(`/timeline/${event._id}`)}
                style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(124,58,237,0.5)", background: "rgba(124,58,237,0.1)", color: "#c4b5fd", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}
              >
                📅 View Event Schedule
              </button>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Location</div>
              <div style={{ fontSize: "16px", fontWeight: 500 }}>{event.location || "Online / TBD"}</div>
              <div style={{ fontSize: "14px", color: "#a78bfa", marginTop: "4px", cursor: "pointer" }}>View Map →</div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Tickets</div>
              <div style={{ fontSize: "32px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>{isPaid ? `₹${event.price}` : "Free"}</div>
            </div>

            <button 
              onClick={() => navigate(`/register/${event._id}`)}
              style={{ padding: "16px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "16px" }}
            >
              Register Now
            </button>

            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: 0 }}>Refunds available up to 24 hours before the event.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
