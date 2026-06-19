
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 16, x: "-50%" }}
      style={{
        position: "fixed", bottom: "32px", left: "50%", zIndex: 9999,
        padding: "12px 24px", borderRadius: "100px",
        fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
        color: "white", display: "flex", alignItems: "center", gap: "10px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        background: type === "success" ? "linear-gradient(135deg,#065f46,#047857)" : "linear-gradient(135deg,#7f1d1d,#991b1b)",
        border: `1px solid ${type === "success" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </motion.div>
  );
}

// ─── Stat card with shimmer gradient ──────────────────────────────────────────
function StatCard({ value, label, accent, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: "1 1 0",
        padding: "22px 24px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(16px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle shimmer top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
      <div style={{ fontSize: "20px", marginBottom: "10px" }}>{icon}</div>
      <div style={{
        fontSize: "clamp(26px, 3vw, 38px)",
        fontFamily: "'Instrument Serif', serif",
        fontStyle: "italic",
        color: accent || "white",
        lineHeight: 1, marginBottom: "6px",
      }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
    </motion.div>
  );
}

// ─── Certificate ring ──────────────────────────────────────────────────────────
function CertRing({ canDownload, isAttended, isCompleted }) {
  const r    = 18;
  const circ = 2 * Math.PI * r;
  const pct  = canDownload ? 1 : isCompleted && isAttended ? 0.8 : isCompleted ? 0.4 : 0.15;
  const col  = canDownload ? "#10b981" : isCompleted ? "#f59e0b" : "rgba(255,255,255,0.12)";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
      <motion.circle
        cx="22" cy="22" r={r}
        fill="none" stroke={col} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="26" textAnchor="middle" fontSize="11" fill={canDownload ? "#10b981" : "rgba(255,255,255,0.25)"}>
        {canDownload ? "✓" : "📜"}
      </text>
    </svg>
  );
}

// ─── Registration card ─────────────────────────────────────────────────────────
function RegCard({ reg, index, onDownload, isDownloading, onMarkAttendance }) {
  const event = reg.event;
  if (!event) return null;

  const [hovered, setHovered] = useState(false);
  const isCompleted = event.status === "completed";
  const isAttended  = reg.attendance;
  const canDownload = isCompleted && isAttended;

  const PAY_STYLES = {
    paid:    { bg: "rgba(16,185,129,0.1)",  color: "#6ee7b7", border: "rgba(16,185,129,0.2)" },
    pending: { bg: "rgba(245,158,11,0.1)",  color: "#fcd34d", border: "rgba(245,158,11,0.2)" },
    failed:  { bg: "rgba(239,68,68,0.1)",   color: "#fca5a5", border: "rgba(239,68,68,0.2)"  },
  };
  const pay = PAY_STYLES[reg.paymentStatus] || PAY_STYLES.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      style={{
        borderRadius: "20px",
        border: `1px solid ${hovered ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(124,58,237,0.12)" : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Top bar */}
      <div style={{
        height: "3px",
        background: isCompleted
          ? canDownload ? "linear-gradient(90deg, #10b981, #059669)" : "rgba(255,255,255,0.07)"
          : "linear-gradient(90deg, #7c3aed, #4f46e5)",
      }} />

      <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <CertRing canDownload={canDownload} isAttended={isAttended} isCompleted={isCompleted} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              color: "white", fontSize: "15px", fontWeight: 500,
              lineHeight: 1.3, margin: "0 0 8px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {event.title}
            </h3>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "10px", padding: "3px 10px", borderRadius: "100px", fontWeight: 500,
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: isCompleted ? "rgba(100,100,100,0.12)" : "rgba(16,185,129,0.1)",
                color: isCompleted ? "rgba(255,255,255,0.3)" : "#6ee7b7",
                border: `1px solid ${isCompleted ? "rgba(255,255,255,0.07)" : "rgba(16,185,129,0.2)"}`,
              }}>
                {isCompleted ? "Completed" : "● Upcoming"}
              </span>
              <span style={{
                fontSize: "10px", padding: "3px 10px", borderRadius: "100px", fontWeight: 500,
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: pay.bg, color: pay.color, border: `1px solid ${pay.border}`,
              }}>
                {reg.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {[
            { icon: "📅", text: new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
            { icon: "🏷️", text: event.category },
            { icon: "💰", text: event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}` },
            { icon: "✓",  text: isAttended ? "Attendance marked" : "Attendance pending", muted: !isAttended },
          ].map(({ icon, text, muted }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", width: "16px", textAlign: "center", opacity: muted ? 0.35 : 1 }}>{icon}</span>
              <span style={{ fontSize: "13px", color: muted ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.48)" }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          Registered {new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>

        {/* Mark Attendance button (shows only when upcoming and not yet attended) */}
        {!isCompleted && !isAttended && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => onMarkAttendance(reg._id)}
            style={{
              width: "100%", padding: "10px",
              borderRadius: "10px", border: "1px solid rgba(124,58,237,0.3)",
              fontSize: "13px", fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              background: "rgba(124,58,237,0.08)",
              color: "#c4b5fd",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            Mark my attendance
          </motion.button>
        )}

        {/* Certificate button */}
        <motion.button
          whileHover={canDownload ? { scale: 1.02 } : {}}
          whileTap={canDownload ? { scale: 0.97 } : {}}
          onClick={() => canDownload && !isDownloading && onDownload(event._id, event.title)}
          disabled={!canDownload || isDownloading}
          style={{
            width: "100%", padding: "11px",
            borderRadius: "10px", border: "none",
            fontSize: "13px", fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: canDownload && !isDownloading ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            ...(canDownload ? {
              background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
              color: "#6ee7b7",
              boxShadow: "0 0 20px rgba(16,185,129,0.2)",
            } : {
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.18)",
            }),
          }}
        >
          {isDownloading        ? "Downloading…"
            : canDownload       ? "↓ Download certificate"
            : isCompleted       ? "Requires attendance mark"
            : "Available after event"}
        </motion.button>

        {/* Community Button */}
        <a 
          href={`/community/${event._id}`}
          style={{
             display: "block",
             textAlign: "center", textDecoration: "none",
             width: "100%", padding: "11px", boxSizing: "border-box",
             borderRadius: "10px", border: "1px solid rgba(124,58,237,0.3)",
             fontSize: "13px", fontWeight: 500,
             fontFamily: "'DM Sans', sans-serif",
             background: "rgba(124,58,237,0.08)",
             color: "#c4b5fd",
             transition: "all 0.2s"
          }}
        >
          View Community Hub
        </a>

        {/* Gallery Button */}
        <a 
          href={`/gallery/${event._id}`}
          style={{
             display: "block",
             textAlign: "center", textDecoration: "none",
             width: "100%", padding: "11px", boxSizing: "border-box",
             borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)",
             fontSize: "13px", fontWeight: 500,
             fontFamily: "'DM Sans', sans-serif",
             background: "rgba(16,185,129,0.08)",
             color: "#6ee7b7",
             transition: "all 0.2s"
          }}
        >
          View Event Photos
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrations, setRegs] = useState([]);
  const [loading, setLoading]    = useState(true);
  const [downloadingId, setDlId] = useState(null);
  const [toast, setToast]        = useState(null);
  const [activeTab, setTab]      = useState("All");
  const [userName, setUserName]  = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth"); return; }
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || "");
      fetchRegs(token);
    } catch { navigate("/auth"); }

    // Show success toast if redirected after registration
    if (location.state?.success) {
      setToast({ message: location.state.success, type: "success" });
      window.history.replaceState({}, ""); // clear state so it doesn't re-show on refresh
    }
  }, [navigate, location.state?.success]);


  const fetchRegs = async (token) => {
    try {
      const r = await axios.get(`${API}/registrations/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegs(r.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); navigate("/auth"); }
    } finally { setLoading(false); }
  };

  const handleDownload = useCallback(async (eventId, eventTitle) => {
    const token = localStorage.getItem("token");
    setDlId(eventId);
    try {
      const res = await axios.get(`${API}/certificate/generate/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${eventTitle.replace(/\s+/g, "-")}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: "Certificate downloaded! 🎓", type: "success" });
    } catch (err) {
      let msg = "Could not download certificate";
      if (err.response?.data instanceof Blob) {
        try { msg = JSON.parse(await err.response.data.text()).message || msg; } catch {}
      }
      setToast({ message: msg, type: "error" });
    } finally { setDlId(null); }
  }, []);

  const handleMarkAttendance = useCallback(async (registrationId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`${API}/registrations/${registrationId}/attendance`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegs(prev => prev.map(r => r._id === registrationId ? { ...r, attendance: true } : r));
      setToast({ message: "Attendance marked! ✓", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to mark attendance", type: "error" });
    }
  }, []);

  const total     = registrations.length;
  const upcoming  = registrations.filter(r => r.event?.status !== "completed").length;
  const completed = registrations.filter(r => r.event?.status === "completed").length;
  const certs     = registrations.filter(r => r.event?.status === "completed" && r.attendance).length;

  const visible = registrations.filter(r => {
    if (activeTab === "Upcoming")  return r.event?.status !== "completed";
    if (activeTab === "Completed") return r.event?.status === "completed";
    return true;
  });

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07070f" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: "36px", height: "36px", border: "3px solid rgba(124,58,237,0.2)", borderTopColor: "#7c3aed", borderRadius: "50%" }}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      fontFamily: "'DM Sans', sans-serif",
      color: "white",
      padding: "96px 24px 80px",
    }}>
      {/* Ambient */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", top: "-200px", right: "-150px", background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", bottom: "0", left: "-100px", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)" }} />
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "36px" }}
        >
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "13px", marginBottom: "6px" }}>
            {greeting()}{userName ? `, ${userName.split(" ")[0]}` : ""} 👋
          </p>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic", fontWeight: 400,
            margin: 0, lineHeight: 1.1,
          }}>
            My Dashboard
          </h1>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "36px" }}>
          <StatCard value={total}     label="Registered"   accent="white"    icon="🎟️" delay={0}    />
          <StatCard value={upcoming}  label="Upcoming"     accent="#a78bfa"  icon="📅" delay={0.08} />
          <StatCard value={completed} label="Completed"    accent="#6ee7b7"  icon="✓"  delay={0.16} />
          <StatCard value={certs}     label="Certificates" accent="#fcd34d"  icon="📜" delay={0.24} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          {["All", "Upcoming", "Completed"].map(tab => {
            const active = tab === activeTab;
            const count  = tab === "All" ? total : tab === "Upcoming" ? upcoming : completed;
            return (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setTab(tab)}
                style={{
                  padding: "7px 18px", borderRadius: "100px",
                  border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                  background: active ? "rgba(124,58,237,0.18)" : "transparent",
                  color: active ? "#c4b5fd" : "rgba(255,255,255,0.38)",
                  fontSize: "13px", fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
              >
                {tab}
                <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.6 }}>{count}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {registrations.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "100px 24px" }}
            >
              <div style={{ fontSize: "52px", marginBottom: "16px", opacity: 0.25 }}>◌</div>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.38)", marginBottom: "8px" }}>No registrations yet</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.2)", marginBottom: "32px" }}>Browse events and register to see them here</p>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/events")}
                style={{
                  padding: "12px 28px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "white", fontSize: "14px", fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxShadow: "0 0 28px rgba(124,58,237,0.35)",
                }}
              >
                Browse events →
              </motion.button>
            </motion.div>
          ) : visible.length === 0 ? (
            <motion.div
              key="tab-empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.22)", fontSize: "14px" }}
            >
              No {activeTab.toLowerCase()} events
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}
            >
              {visible.map((reg, i) => (
                <RegCard
                  key={reg._id}
                  reg={reg}
                  index={i}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === reg.event?._id}
                  onMarkAttendance={handleMarkAttendance}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
