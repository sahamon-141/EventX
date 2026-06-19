import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API from "../api";

// ─── Field component ───────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{
        display: "block", marginBottom: "8px",
        fontSize: "11px", fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
      }}>
        {label}{required && <span style={{ color: "#a78bfa", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  fontSize: "14px",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const focusStyle = { borderColor: "rgba(124,58,237,0.6)" };
const blurStyle  = { borderColor: "rgba(255,255,255,0.1)" };

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function RegistrationModal({ event, onClose, onSuccess }) {
  // Pre-fill name from JWT
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p = JSON.parse(atob(token.split(".")[1]));
        setUserName(p.name || "");
        setUserEmail(p.email || "");
      }
    } catch {}
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const [step, setStep]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [participationType, setPartType]  = useState("solo");

  const [form, setForm] = useState({
    phone: "",
    organisation: "",
    teamName: "",
    notes: "",
  });
  const [teamMembers, setTeamMembers] = useState([""]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Team member helpers
  const updateMember = (i, val) => setTeamMembers(m => m.map((x, idx) => idx === i ? val : x));
  const addMember    = () => setTeamMembers(m => [...m, ""]);
  const removeMember = (i) => setTeamMembers(m => m.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        phone: form.phone,
        organisation: form.organisation,
        participationType,
        notes: form.notes,
        teamName: participationType === "team" ? form.teamName : "",
        teamMembers: participationType === "team" ? teamMembers.filter(m => m.trim()) : [],
      };
      await axios.post(`${API}/registrations/register/${event._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess(`You're registered for "${event.title}"! 🎉`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CAT_COL = {
    Tech:     "#93c5fd", Workshop: "#6ee7b7",
    Seminar:  "#fcd34d", Sports:   "#fca5a5",
  };
  const catColor = CAT_COL[event.category] || "#a78bfa";

  const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          zIndex: 201,
          width: "min(520px, 100vw)",
          background: "#0d0d1a",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          overflowY: "auto",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky", top: 0, zIndex: 10,
          background: "#0d0d1a",
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "rgba(255,255,255,0.06)", border: "none",
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
              width: "32px", height: "32px", borderRadius: "50%",
              fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            ×
          </button>

          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
            Event Registration
          </p>
          <h2 style={{ color: "white", fontSize: "20px", fontWeight: 500, margin: 0, lineHeight: 1.3, paddingRight: "40px" }}>
            {event.title}
          </h2>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
            {["Your details", "Participation", "Review"].map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const curr = step === n;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 600, flexShrink: 0,
                    background: done ? "#7c3aed" : curr ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${done || curr ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
                    color: done || curr ? (done ? "white" : "#a78bfa") : "rgba(255,255,255,0.3)",
                  }}>
                    {done ? "✓" : n}
                  </div>
                  <span style={{ fontSize: "12px", color: curr ? "white" : "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                  {i < 2 && <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Event summary strip ── */}
        <div style={{
          margin: "20px 28px 0",
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: "16px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>Date</div>
            <div style={{ color: "white", fontSize: "13px" }}>{eventDate}</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.07)" }} />
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>Category</div>
            <div style={{ color: catColor, fontSize: "13px" }}>{event.category}</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.07)" }} />
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>Tickets</div>
            <div style={{ color: event.price === 0 ? "#6ee7b7" : "white", fontSize: "13px" }}>
              {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "24px 28px", flex: 1 }}>
          <AnimatePresence mode="wait">

            {/* ─ Step 1: Your details ─ */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Field label="Full name" required>
                  <input
                    style={inputStyle} value={userName} readOnly
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)}
                    placeholder="Your full name"
                  />
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "5px" }}>
                    Pre-filled from your account
                  </p>
                </Field>

                <Field label="Email address" required>
                  <input
                    style={inputStyle} value={userEmail} readOnly
                    placeholder="you@example.com"
                  />
                </Field>

                <Field label="Phone number">
                  <input
                    style={inputStyle}
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    type="tel"
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>

                <Field label="College / Organisation">
                  <input
                    style={inputStyle}
                    value={form.organisation}
                    onChange={e => set("organisation", e.target.value)}
                    placeholder="e.g. VIT-AP University"
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>
              </motion.div>
            )}

            {/* ─ Step 2: Participation ─ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Field label="Participation type" required>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[
                      { val: "solo", label: "Solo", icon: "👤", desc: "Register as individual" },
                      { val: "team", label: "Team", icon: "👥", desc: "Register with a team" },
                    ].map(({ val, label, icon, desc }) => {
                      const active = participationType === val;
                      return (
                        <motion.div
                          key={val}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setPartType(val)}
                          style={{
                            flex: 1, padding: "14px", borderRadius: "12px", cursor: "pointer",
                            border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                            background: active ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ fontSize: "20px", marginBottom: "6px" }}>{icon}</div>
                          <div style={{ color: active ? "#c4b5fd" : "white", fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>{label}</div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{desc}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Field>

                {/* Team section */}
                <AnimatePresence>
                  {participationType === "team" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <Field label="Team name" required>
                        <input
                          style={inputStyle}
                          value={form.teamName}
                          onChange={e => set("teamName", e.target.value)}
                          placeholder="e.g. The Innovators"
                          onFocus={e => Object.assign(e.target.style, focusStyle)}
                          onBlur={e => Object.assign(e.target.style, blurStyle)}
                        />
                      </Field>

                      <Field label="Team members">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {teamMembers.map((member, i) => (
                            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input
                                style={{ ...inputStyle, flex: 1 }}
                                value={member}
                                onChange={e => updateMember(i, e.target.value)}
                                placeholder={`Member ${i + 1} name`}
                                onFocus={e => Object.assign(e.target.style, focusStyle)}
                                onBlur={e => Object.assign(e.target.style, blurStyle)}
                              />
                              {teamMembers.length > 1 && (
                                <button
                                  onClick={() => removeMember(i)}
                                  style={{
                                    width: "36px", height: "36px", flexShrink: 0,
                                    borderRadius: "8px", border: "none",
                                    background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                                    cursor: "pointer", fontSize: "16px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                          {teamMembers.length < 8 && (
                            <button
                              onClick={addMember}
                              style={{
                                padding: "9px 14px",
                                borderRadius: "9px",
                                border: "1px dashed rgba(124,58,237,0.35)",
                                background: "transparent", color: "#a78bfa",
                                fontSize: "13px", cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                textAlign: "left", transition: "all 0.2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              + Add member
                            </button>
                          )}
                        </div>
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field label="Additional notes / requirements">
                  <textarea
                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    placeholder="Any dietary restrictions, accessibility needs, or questions for the organiser…"
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>
              </motion.div>
            )}

            {/* ─ Step 3: Review ─ */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px", lineHeight: 1.6 }}>
                  Please review your registration details before confirming.
                </p>

                {/* Summary card */}
                <div style={{
                  borderRadius: "14px", overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                  marginBottom: "20px",
                }}>
                  {[
                    { label: "Name",         value: userName },
                    { label: "Email",        value: userEmail },
                    { label: "Phone",        value: form.phone || "—" },
                    { label: "Organisation", value: form.organisation || "—" },
                    { label: "Participation", value: participationType === "team" ? "Team" : "Solo" },
                    ...(participationType === "team" ? [
                      { label: "Team name", value: form.teamName || "—" },
                      { label: "Members", value: teamMembers.filter(m => m.trim()).join(", ") || "—" },
                    ] : []),
                    { label: "Notes", value: form.notes || "—" },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label} style={{
                      display: "flex", gap: "16px",
                      padding: "12px 16px",
                      background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", width: "110px", flexShrink: 0 }}>{label}</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", wordBreak: "break-word" }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Price summary */}
                <div style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: event.price === 0 ? "rgba(16,185,129,0.08)" : "rgba(124,58,237,0.08)",
                  border: `1px solid ${event.price === 0 ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.2)"}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "20px",
                }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Total amount</span>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: event.price === 0 ? "#6ee7b7" : "white" }}>
                    {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
                  </span>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: "12px 14px", borderRadius: "10px", marginBottom: "16px",
                      background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                      color: "#f87171", fontSize: "13px",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer buttons ── */}
        <div style={{
          padding: "20px 28px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: "10px",
          position: "sticky", bottom: 0,
          background: "#0d0d1a",
        }}>
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setStep(s => s - 1)}
              style={{
                padding: "12px 20px", borderRadius: "10px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.55)", fontSize: "14px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Back
            </motion.button>
          )}

          {step < 3 ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setStep(s => s + 1)}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                color: "white", fontSize: "14px", fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                boxShadow: "0 0 24px rgba(124,58,237,0.3)",
              }}
            >
              Continue →
            </motion.button>
          ) : (
            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: "10px", border: "none",
                background: loading
                  ? "rgba(124,58,237,0.4)"
                  : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                color: "white", fontSize: "14px", fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 24px rgba(124,58,237,0.3)",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }}
                  />
                  Confirming…
                </>
              ) : (
                "Confirm Registration ✓"
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
