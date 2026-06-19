import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const LINKS = [
  { label: "Home",      path: "/" },
  { label: "Events",    path: "/events" },
  { label: "Pricing",   path: "/pricing" },
  { label: "Blog",      path: "/blog" },
  { label: "Help",      path: "/help" },
  { label: "Verify",    path: "/verify" },
  { label: "Dashboard", path: "/dashboard", authOnly: true },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setIsLoggedIn(false);
    navigate("/");
  };

  const visibleLinks = LINKS.filter(l => !l.authOnly || isLoggedIn);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        style={{
          position: "fixed",
          top: scrolled ? "16px" : "0px",
          left: 0, right: 0,
          zIndex: 100,
          display: "flex", justifyContent: "center",
          transition: "top 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none" // allow clicks to pass through wrapper
        }}
      >
        <motion.div
          animate={{
            width: scrolled ? "980px" : "100%",
            borderRadius: scrolled ? "32px" : "0px",
            border: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            background: scrolled ? "rgba(7,7,15,0.65)" : "rgba(7,7,15,0)",
            boxShadow: scrolled ? "0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.1) inset" : "none",
            backdropFilter: scrolled ? "blur(30px)" : "blur(0px)",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            pointerEvents: "auto", // re-enable clicks on the pill
            maxWidth: "1200px",
            padding: scrolled ? "8px 24px" : "24px 48px",
            height: "72px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxSizing: "border-box"
          }}
        >
          {/* ── Logo ── */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}
          >
            <span style={{ fontSize: "24px", fontWeight: 300, color: "white", letterSpacing: "0.03em", fontFamily: "'DM Sans', sans-serif" }}>Event</span>
            <span style={{ fontSize: "24px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", background: "linear-gradient(135deg, #c4b5fd, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>X</span>
          </motion.div>

          {/* ── Center Links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: scrolled ? "rgba(255,255,255,0.03)" : "transparent", padding: "4px", borderRadius: "100px", border: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none", flexShrink: 0 }}>
            {visibleLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    position: "relative",
                    textDecoration: "none",
                    padding: "10px 20px",
                    borderRadius: "100px",
                    fontSize: "14px", fontWeight: active ? 600 : 500,
                    color: active ? "white" : "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                  onMouseEnter={e => e.target.style.color = "white"}
                  onMouseLeave={e => e.target.style.color = active ? "white" : "rgba(255,255,255,0.5)"}
                >
                  <span style={{ position: "relative", zIndex: 2 }}>{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      style={{
                        position: "absolute", inset: 0,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "100px",
                        zIndex: 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            {isLoggedIn ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <motion.div 
                  whileHover={{ scale: 1.08, rotate: 5 }} whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/profile")}
                  style={{ 
                    width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", 
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center", 
                    cursor: "pointer", fontWeight: "bold", fontSize: "16px", border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 4px 15px rgba(124,58,237,0.4)", flexShrink: 0
                  }}
                  title="My Profile"
                >
                  {(() => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    return user?.name ? user.name.charAt(0).toUpperCase() : "U";
                  })()}
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  style={{
                    padding: "10px 20px", borderRadius: "100px", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "13px", fontWeight: 500,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  Sign out
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(124,58,237,0.4)" }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                style={{
                  padding: "10px 24px", borderRadius: "100px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  border: "none", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Get started ✨
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
