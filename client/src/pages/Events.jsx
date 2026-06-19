
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

const CATEGORIES = ["All", "Tech", "Workshop", "Seminar", "Sports"];

const CAT_CONFIG = {
  Tech:     { bg: "rgba(59,130,246,0.12)",  color: "#93c5fd", border: "rgba(59,130,246,0.25)",  glow: "rgba(59,130,246,0.15)"  },
  Workshop: { bg: "rgba(16,185,129,0.12)",  color: "#6ee7b7", border: "rgba(16,185,129,0.25)",  glow: "rgba(16,185,129,0.15)"  },
  Seminar:  { bg: "rgba(245,158,11,0.12)",  color: "#fcd34d", border: "rgba(245,158,11,0.25)",  glow: "rgba(245,158,11,0.15)"  },
  Sports:   { bg: "rgba(239,68,68,0.12)",   color: "#fca5a5", border: "rgba(239,68,68,0.25)",   glow: "rgba(239,68,68,0.15)"   },
};

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0,  x: "-50%" }}
      exit={{    opacity: 0, y: 16,  x: "-50%" }}
      style={{
        position: "fixed", bottom: "32px", left: "50%",
        zIndex: 9999,
        padding: "12px 24px",
        borderRadius: "100px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px", fontWeight: 500,
        color: "white",
        display: "flex", alignItems: "center", gap: "10px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        background: type === "success"
          ? "linear-gradient(135deg, #065f46, #047857)"
          : "linear-gradient(135deg, #7f1d1d, #991b1b)",
        border: `1px solid ${type === "success" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <span style={{ fontSize: "16px" }}>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </motion.div>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: "20px", padding: "28px",
      border: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(255,255,255,0.02)",
      display: "flex", flexDirection: "column", gap: "14px",
    }}>
      {["45%", "70%", "55%", "90%", "90%", "100%"].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? "20px" : i === 5 ? "42px" : "14px",
          width: w, borderRadius: "6px",
          background: "rgba(255,255,255,0.05)",
          animation: "shimmer 1.6s ease-in-out infinite",
          animationDelay: `${i * 0.08}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Capacity bar ──────────────────────────────────────────────────────────────
function CapacityBar({ count, max }) {
  const pct   = max > 0 ? Math.min((count / max) * 100, 100) : 0;
  const color = pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#10b981";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Capacity
        </span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
          {count} / {max}
        </span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: "2px", background: color }}
        />
      </div>
    </div>
  );
}

// ─── Event card ────────────────────────────────────────────────────────────────
function EventCard({ event, onRegister, isRegistering, index }) {
  const [count, setCount]     = useState(0);
  const [hovered, setHovered] = useState(false);
  const isCompleted = event.status === "completed";
  const cat  = CAT_CONFIG[event.category] || CAT_CONFIG.Tech;
  const isFull = count >= event.maxParticipants;

  useEffect(() => {
    axios.get(`${API}/registrations/count/${event._id}`)
      .then(r => setCount(r.data.count))
      .catch(() => {});
  }, [event._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      style={{
        borderRadius: "20px",
        padding: "0",
        border: `1px solid ${hovered ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.06)"}`,
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(16px)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        cursor: "default",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)`
          : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: "3px",
        background: isCompleted
          ? "rgba(255,255,255,0.08)"
          : `linear-gradient(90deg, ${cat.border}, transparent)`,
        transition: "background 0.3s",
      }} />

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, gap: "0" }}>
        {/* Tags */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px",
            background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`,
          }}>
            {event.category}
          </span>
          <span style={{
            fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em",
            textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px",
            background: isCompleted ? "rgba(100,100,100,0.1)" : "rgba(16,185,129,0.1)",
            color: isCompleted ? "rgba(255,255,255,0.25)" : "#6ee7b7",
            border: `1px solid ${isCompleted ? "rgba(255,255,255,0.06)" : "rgba(16,185,129,0.2)"}`,
          }}>
            {isCompleted ? "Completed" : "● Live"}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          color: "white", fontSize: "17px", fontWeight: 500,
          lineHeight: 1.35, marginBottom: "10px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {event.title}
        </h2>

        {/* Description */}
        <p style={{
          color: "rgba(255,255,255,0.35)", fontSize: "13px",
          lineHeight: 1.7, marginBottom: "20px", flex: 1,
        }}>
          {event.description || "No description provided."}
        </p>

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
          {[
            { icon: "📅", text: new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
            { icon: "💰", text: event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}` },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px" }}>{icon}</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Capacity */}
        <div style={{ marginBottom: "18px" }}>
          <CapacityBar count={count} max={event.maxParticipants} />
        </div>

        {/* Button */}
        <motion.button
          whileTap={!isCompleted && !isFull ? { scale: 0.97 } : {}}
          onClick={() => !isCompleted && !isFull && onRegister(event._id)}
          disabled={isCompleted || isFull || isRegistering}
          style={{
            width: "100%", padding: "12px",
            borderRadius: "10px", border: "none",
            fontSize: "13px", fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: isCompleted || isFull ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            ...(isCompleted || isFull ? {
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.2)",
            } : {
              background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
              color: "white",
              boxShadow: hovered
                ? "0 0 28px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.12)"
                : "0 0 16px rgba(124,58,237,0.2)",
            }),
          }}
        >
          {isRegistering ? "Registering…"
            : isCompleted ? "Event ended"
            : isFull      ? "Event full"
            : "Register now →"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents]            = useState([]);
  const [loading, setLoading]          = useState(true);
  const [toast, setToast]              = useState(null);
  const [search, setSearch]            = useState("");
  const [activeCategory, setActiveCat] = useState("All");

  useEffect(() => {
    axios.get(`${API}/events`)
      .then(r => setEvents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRegisterClick = (event) => {
    navigate(`/event-details/${event._id}`);
  };

  const visible = events.filter(e => {
    const matchCat    = activeCategory === "All" || e.category === activeCategory;
    const matchSearch = !search.trim() ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      fontFamily: "'DM Sans', sans-serif",
      color: "white",
      padding: "96px 24px 80px",
    }}>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      {/* Ambient */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", top: "-200px", left: "-150px", background: "radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", bottom: "0", right: "-100px", background: "radial-gradient(circle, rgba(67,56,202,0.08) 0%, transparent 65%)" }} />
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "48px" }}
        >
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>
            Discover
          </p>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic", fontWeight: 400,
            margin: "0 0 32px", lineHeight: 1.1,
          }}>
            Upcoming events
          </h1>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "12px 18px",
            marginBottom: "16px",
            transition: "border-color 0.2s",
          }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "18px" }}>⌕</span>
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "white", fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>
                ×
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {CATEGORIES.map(cat => {
              const active = cat === activeCategory;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    padding: "7px 18px", borderRadius: "100px",
                    border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: active ? "rgba(124,58,237,0.18)" : "transparent",
                    color: active ? "#c4b5fd" : "rgba(255,255,255,0.38)",
                    fontSize: "13px", fontWeight: 500, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </motion.button>
              );
            })}
            {!loading && (
              <span style={{ marginLeft: "auto", fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>
                {visible.length} event{visible.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "100px 24px", color: "rgba(255,255,255,0.2)" }}
          >
            <div style={{ fontSize: "52px", marginBottom: "16px", opacity: 0.5 }}>◌</div>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>No events found</p>
            <p style={{ fontSize: "14px", marginBottom: "24px" }}>Try a different search or category</p>
            <button onClick={() => { setSearch(""); setActiveCat("All"); }}
              style={{
                padding: "10px 24px", borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: "rgba(255,255,255,0.45)", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
              }}>
              Clear filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
              {visible.map((event, i) => (
                <EventCard
                  key={event._id}
                  event={event}
                  index={i}
                  onRegister={() => handleRegisterClick(event)}
                  isRegistering={false}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
