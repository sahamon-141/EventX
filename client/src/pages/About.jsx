import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function About() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const team = [
    { name: "Harsh", role: "Founder & CEO", img: "https://i.pravatar.cc/150?img=11" },
    { name: "Sarah Jenkins", role: "Head of Product", img: "https://i.pravatar.cc/150?img=47" },
    { name: "Marcus Chen", role: "Lead Engineer", img: "https://i.pravatar.cc/150?img=33" },
    { name: "Elena Rodriguez", role: "Design Director", img: "https://i.pravatar.cc/150?img=5" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      
      {/* Hero */}
      <div style={{ position: "relative", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.1), #07070f)", y: yBg }} />
        
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ fontSize: "clamp(48px, 6vw, 84px)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, margin: "0 0 24px" }}
          >
            Redefining how the world <br/> gathers.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}
          >
            EventX was built for organizers who are tired of clunky software. We wanted to build a platform that feels like magic.
          </motion.p>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: "120px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "32px", textAlign: "center", marginBottom: "80px", color: "rgba(255,255,255,0.8)" }}>Our Journey</h2>
        
        {[
          { year: "2024", title: "The Idea", desc: "Frustrated with existing platfoms, we started sketching something better." },
          { year: "2025", title: "The Launch", desc: "EventX 1.0 officially launched, securing 10,000+ users in the first month." },
          { year: "2026", title: "The Expansion", desc: "Raised $10M Series A and completely revamped our infrastructure into an Event OS." }
        ].map((item, i) => (
          <motion.div 
            key={item.year}
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: i * 0.2 }}
            style={{ display: "flex", gap: "40px", marginBottom: "60px", position: "relative" }}
          >
            {i !== 2 && <div style={{ position: "absolute", left: "24px", top: "48px", bottom: "-60px", width: "1px", background: "rgba(124,58,237,0.3)" }} />}
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#a78bfa", width: "80px", flexShrink: 0, position: "relative", zIndex: 2, background: "#07070f" }}>{item.year}</div>
            <div>
              <h3 style={{ fontSize: "24px", margin: "0 0 12px" }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team */}
      <div style={{ background: "rgba(255,255,255,0.02)", padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", textAlign: "center", marginBottom: "80px" }}>The team behind the magic</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
            {team.map((t, i) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ width: "180px", height: "180px", margin: "0 auto 24px", borderRadius: "50%", padding: "6px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", filter: "grayscale(100%)", transition: "filter 0.3s" }} 
                     onMouseEnter={e => e.currentTarget.style.filter = "grayscale(0%)"}
                     onMouseLeave={e => e.currentTarget.style.filter = "grayscale(100%)"}>
                  <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #07070f" }} />
                </div>
                <h4 style={{ fontSize: "20px", margin: "0 0 8px" }}>{t.name}</h4>
                <p style={{ color: "#a78bfa", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
