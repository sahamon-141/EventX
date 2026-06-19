import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkHover = {
    scale: 1.05,
    x: 5,
    color: "#ffffff"
  };

  return (
    <footer style={{
      position: "relative",
      background: "#07070f",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      fontFamily: "'DM Sans', sans-serif",
      color: "rgba(255,255,255,0.6)",
      overflow: "hidden"
    }}>
      {/* Background Glows */}
      <div style={{ position: "absolute", bottom: -150, left: "20%", width: 300, height: 300, background: "#7c3aed", filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -150, right: "20%", width: 300, height: 300, background: "#4f46e5", filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px 40px", position: "relative", zIndex: 10 }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "60px", marginBottom: "60px" }}>
          
          {/* Brand Col */}
          <div style={{ gridColumn: "span 2" }}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ display: "inline-flex", alignItems: "center", gap: "2px", marginBottom: "16px", cursor: "pointer" }}>
              <span style={{ fontSize: "28px", fontWeight: 300, color: "white", letterSpacing: "0.03em" }}>Event</span>
              <span style={{ fontSize: "28px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", background: "linear-gradient(135deg, #c4b5fd, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>X</span>
            </motion.div>
            <p style={{ fontSize: "14px", lineHeight: 1.6, maxWidth: "300px", marginBottom: "24px" }}>
              The premium platform for managing, discovering, and hosting world-class events, conferences, and meetups.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: "16px" }}>
              {["𝕏", "in", "IG", "GH"].map((icon, i) => (
                <motion.a 
                  key={i} href="#" 
                  whileHover={{ scale: 1.1, y: -3, color: "white", background: "rgba(255,255,255,0.1)" }}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "inherit", transition: "all 0.3s" }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>Platform</h4>
            <motion.div whileHover={handleLinkHover}><Link to="/events" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Browse Events</Link></motion.div>
            <motion.div whileHover={handleLinkHover}><Link to="/dashboard" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Attendee Dashboard</Link></motion.div>
            <motion.div whileHover={handleLinkHover}><Link to="/verify" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Verify Certificate</Link></motion.div>
            <motion.div whileHover={handleLinkHover}><Link to="/pricing" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Pricing</Link></motion.div>
          </div>

          {/* Links Col 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>Company</h4>
            <motion.div whileHover={handleLinkHover}><Link to="/about" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>About Us</Link></motion.div>
            <motion.div whileHover={handleLinkHover}><Link to="/integrations" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Integrations</Link></motion.div>
            <motion.div whileHover={handleLinkHover}><Link to="/blog" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Blog</Link></motion.div>
            <motion.div whileHover={handleLinkHover}><Link to="/contact" style={{ textDecoration: "none", color: "inherit", fontSize: "14px", display: "inline-block", transition: "color 0.2s" }}>Contact & Support</Link></motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ margin: 0, fontSize: "14px", textAlign: "center" }}>
            © {currentYear} EventX Inc. Designed with precision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
