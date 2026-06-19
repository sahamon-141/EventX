// 📍 File: event-system/client/src/pages/Auth.jsx
//
// 📦 No new installs — uses existing framer-motion, react-router-dom, axios
// 🔤 Uses fonts already loaded in index.html (Instrument Serif + DM Sans)

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";

// ─── Password strength ─────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: "Weak",   color: "#ef4444" };
  if (score <= 3) return { score: 3, label: "Fair",   color: "#f59e0b" };
  return            { score: 5, label: "Strong", color: "#10b981" };
}

// ─── Floating orb on the left panel ───────────────────────────────────────────
function Orb({ cx, cy, r, color, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 6 + delay, ease: "easeInOut", delay }}
      style={{
        position: "absolute",
        left: cx, top: cy,
        width: r, height: r,
        borderRadius: "50%",
        background: color,
        filter: "blur(60px)",
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Input field component ─────────────────────────────────────────────────────
function Field({ label, type, name, value, onChange, onKeyDown, placeholder, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        marginBottom: "8px",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            fontSize: "14px",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        {children}
      </div>
    </div>
  );
}

// ─── Main Auth component ───────────────────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm]     = useState({ name: "", email: "", password: "" });

  const strength = getStrength(form.password);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const url = isLogin ? `${API}/users/login` : `${API}/users/register`;
      const res = await axios.post(url, form);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      } else {
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
        setError("✓ Account created! Please log in.");
      }
    } catch (err) {
      if (!err.response) {
        // Network error — backend is down or unreachable
        setError("Cannot connect to server. Make sure the backend is running on port 5000.");
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setIsLogin(!isLogin); setError(""); setForm({ name: "", email: "", password: "" }); };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#07070f",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── Left panel — brand / visual ─────────────────────────────────────── */}
      <div className="hidden lg:flex" style={{
        flex: "1",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #0d0d1f 0%, #0a0a18 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
      }}>
        {/* Ambient orbs */}
        <Orb cx="-80px"  cy="-80px"  r="400px" color="#7c3aed" delay={0}   />
        <Orb cx="40%"    cy="50%"    r="350px" color="#4f46e5" delay={1.5} />
        <Orb cx="60%"    cy="80%"    r="300px" color="#6d28d9" delay={3}   />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{
            fontSize: "22px",
            fontWeight: 300,
            color: "white",
            letterSpacing: "0.04em",
          }}>
            Event<span style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              background: "linear-gradient(135deg, #c4b5fd, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>X</span>
          </span>
        </div>

        {/* Centre quote */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{
            fontSize: "clamp(28px, 3vw, 42px)",
            color: "white",
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: "24px",
          }}>
            "Every great event<br />starts with a single<br />registration."
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
            — EventX platform
          </p>
        </div>

        {/* Bottom stats */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "40px" }}>
          {[["1,200+", "Events"], ["48k+", "Users"], ["99%", "Uptime"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: "22px", color: "white", fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>{val}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────────── */}
      <div style={{
        flex: "0 0 auto",
        width: "100%",
        maxWidth: "520px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 48px",
        position: "relative",
        overflowY: "auto",
      }}>

        {/* Mobile logo */}
        <div className="lg:hidden" style={{ marginBottom: "40px" }}>
          <span style={{ fontSize: "20px", fontWeight: 300, color: "white" }}>
            Event<span style={{
              fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
              background: "linear-gradient(135deg, #c4b5fd, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>X</span>
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "36px",
        }}>
          {["Login", "Register"].map((tab) => {
            const active = (tab === "Login") === isLogin;
            return (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === "Login"); setError(""); setForm({ name: "", email: "", password: "" }); }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  background: active ? "rgba(124,58,237,0.25)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.35)",
                  borderColor: active ? "rgba(124,58,237,0.3)" : "transparent",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Heading */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: "32px" }}
          >
            <h1 style={{ fontSize: "28px", fontWeight: 300, color: "white", margin: "0 0 8px" }}>
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", margin: 0 }}>
              {isLogin
                ? "Sign in to access your events and certificates."
                : "Join EventX and start managing events in minutes."}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Form fields */}
        <AnimatePresence>
          {!isLogin && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
              <Field label="Full name" type="text" name="name" value={form.name}
                placeholder="Your full name" onChange={handleChange} onKeyDown={handleKeyDown} />
            </motion.div>
          )}
        </AnimatePresence>

        <Field label="Email address" type="email" name="email" value={form.email}
          placeholder="you@example.com" onChange={handleChange} onKeyDown={handleKeyDown} />

        <Field label="Password" type={showPw ? "text" : "password"} name="password" value={form.password}
          placeholder={isLogin ? "Your password" : "Min. 6 characters"} onChange={handleChange} onKeyDown={handleKeyDown}>
          {/* Show/hide toggle */}
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.35)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </Field>

        {/* Password strength bar (register only) */}
        {!isLogin && form.password && (
          <div style={{ marginTop: "-10px", marginBottom: "18px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
            <span style={{ fontSize: "11px", color: strength.color }}>{strength.label}</span>
          </div>
        )}

        {/* Error / success */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "13px",
                marginBottom: "16px",
                color: error.startsWith("✓") ? "#10b981" : "#f87171",
                padding: "10px 14px",
                borderRadius: "8px",
                background: error.startsWith("✓") ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
                border: `1px solid ${error.startsWith("✓") ? "rgba(16,185,129,0.2)" : "rgba(248,113,113,0.2)"}`,
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "white",
            fontFamily: "'DM Sans', sans-serif",
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            boxShadow: "0 0 24px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
            opacity: loading ? 0.65 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading
            ? "Please wait…"
            : isLogin ? "Sign in →" : "Create account →"}
        </motion.button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={switchMode}
            style={{ color: "#a78bfa", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>

      </div>
    </div>
  );
}
