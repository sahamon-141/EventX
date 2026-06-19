import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "white", fontSize: "14px", outline: "none",
  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s",
};
const onFocus = e => (e.target.style.borderColor = "rgba(124,58,237,0.6)");
const onBlur  = e => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

function Label({ text, required }) {
  return (
    <label style={{
      display: "block", marginBottom: "7px",
      fontSize: "11px", fontWeight: 500,
      letterSpacing: "0.08em", textTransform: "uppercase",
      color: "rgba(255,255,255,0.4)",
    }}>
      {text}{required && <span style={{ color: "#a78bfa", marginLeft: "3px" }}>*</span>}
    </label>
  );
}

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Label text={label} required={required} />
      {children}
    </div>
  );
}

// ─── Step indicator ────────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Your details", "Participation", "Review & Pay"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "36px" }}>
      {steps.map((label, i) => {
        const n    = i + 1;
        const done = current > n;
        const curr = current === n;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? "1" : "0" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 600,
                background: done ? "#7c3aed" : curr ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${done || curr ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.1)"}`,
                color: done ? "white" : curr ? "#a78bfa" : "rgba(255,255,255,0.3)",
                transition: "all 0.3s",
              }}>
                {done ? "✓" : n}
              </div>
              <span style={{
                fontSize: "11px", whiteSpace: "nowrap",
                color: curr ? "white" : "rgba(255,255,255,0.28)",
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "1px", margin: "0 10px",
                marginBottom: "18px",
                background: done ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Razorpay loader ───────────────────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ─── Main Register page ────────────────────────────────────────────────────────
export default function Register() {
  const { eventId } = useParams();
  const navigate    = useNavigate();

  const [event, setEvent]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [step, setStep]           = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [partType, setPartType]   = useState("solo");
  const [teamMembers, setMembers] = useState([""]);

  const [form, setForm] = useState({
    phone: "", organisation: "", teamName: "", notes: "",
  });

  // Pre-fill name/email from JWT
  const [userName, setUserName]   = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth"); return; }
    try {
      const p = JSON.parse(atob(token.split(".")[1]));
      setUserName(p.name || "");
      setUserEmail(p.email || "");
    } catch {}

    axios.get(`${API}/events/${eventId}`)
      .then(r => setEvent(r.data))
      .catch(() => setEvent("notfound"))
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const updateMember = (i, v) => setMembers(m => m.map((x, idx) => idx === i ? v : x));
  const addMember    = () => setMembers(m => [...m, ""]);
  const removeMember = (i) => setMembers(m => m.filter((_, idx) => idx !== i));

  // ── Payment + registration ──────────────────────────────────────────────────
  const handleFreeRegister = useCallback(async () => {
    setSubmitting(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const payload = {
        phone: form.phone, organisation: form.organisation,
        participationType: partType, notes: form.notes,
        teamName: partType === "team" ? form.teamName : "",
        teamMembers: partType === "team" ? teamMembers.filter(m => m.trim()) : [],
      };
      const res = await axios.post(`${API}/registrations/register/${eventId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/payment-success/${eventId}`, { 
        state: { registrationId: res.data.registration._id, eventTitle: event.title } 
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }, [form, partType, teamMembers, eventId, event, navigate]);

  const handlePaidRegister = useCallback(async () => {
    setSubmitting(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      // 1. Create Razorpay order
      const orderRes = await axios.post(`${API}/payments/create-order`, {
        amount: event.price, currency: "INR",
        eventId, eventTitle: event.title,
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (orderRes.data.notConfigured) {
        setError("⚠️ Payment gateway not set up yet. Add your Razorpay keys to server/.env to accept payments.");
        setSubmitting(false);
        return;
      }

      // 2. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setError("Failed to load payment SDK. Check your internet connection.");
        setSubmitting(false);
        return;
      }

      // 3. Open Razorpay checkout
      const options = {
        key:         orderRes.data.keyId,
        amount:      orderRes.data.amount,
        currency:    orderRes.data.currency,
        name:        "EventX",
        description: event.title,
        order_id:    orderRes.data.orderId,
        prefill: { name: userName, email: userEmail, contact: form.phone },
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => { setSubmitting(false); } },
        handler: async (response) => {
          try {
            // 4. Verify payment signature on backend
            await axios.post(`${API}/payments/verify`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${token}` } });

            // 5. Create the registration record (paid)
            const payload = {
              phone: form.phone, organisation: form.organisation,
              participationType: partType, notes: form.notes,
              teamName: partType === "team" ? form.teamName : "",
              teamMembers: partType === "team" ? teamMembers.filter(m => m.trim()) : [],
              paymentId: response.razorpay_payment_id,
            };
            const res = await axios.post(`${API}/registrations/register/${eventId}`, payload, {
              headers: { Authorization: `Bearer ${token}` },
            });

            navigate(`/payment-success/${eventId}`, { 
              state: { registrationId: res.data.registration._id, eventTitle: event.title } 
            });
          } catch (err) {
            navigate(`/payment-failure/${eventId}`, {
              state: { error: err.response?.data?.message || "Payment completed but registration failed. Contact support." }
            });
            setSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not initiate payment.");
      setSubmitting(false);
    }
  }, [form, partType, teamMembers, eventId, event, userName, userEmail, navigate]);

  const handleConfirm = () => {
    if (event.price > 0) {
      handlePaidRegister();
    } else {
      handleFreeRegister();
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07070f" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        style={{ width: "36px", height: "36px", border: "3px solid rgba(124,58,237,0.15)", borderTopColor: "#7c3aed", borderRadius: "50%" }} />
    </div>
  );

  if (event === "notfound") return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#07070f", color: "white", fontFamily: "'DM Sans', sans-serif", gap: "12px" }}>
      <div style={{ fontSize: "60px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#7c3aed" }}>404</div>
      <p style={{ color: "rgba(255,255,255,0.4)" }}>Event not found</p>
      <button onClick={() => navigate("/events")} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
        ← Browse events
      </button>
    </div>
  );

  const isPaid      = event.price > 0;
  const eventDate   = new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const CAT_COL = { Tech: "#93c5fd", Workshop: "#6ee7b7", Seminar: "#fcd34d", Sports: "#fca5a5" };
  const catColor = CAT_COL[event.category] || "#a78bfa";

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", fontFamily: "'DM Sans', sans-serif", color: "white" }}>

      {/* Ambient */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", top: "-280px", left: "-200px", background: "radial-gradient(circle,rgba(109,40,217,0.1) 0%,transparent 65%)" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", bottom: "-150px", right: "-100px", background: "radial-gradient(circle,rgba(67,56,202,0.08) 0%,transparent 65%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "100px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "48px", alignItems: "start" }} className="reg-grid">

        {/* ── LEFT: Event summary ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ position: "sticky", top: "96px" }}>

          {/* Back button */}
          <button onClick={() => navigate("/events")}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "13px", marginBottom: "28px", fontFamily: "'DM Sans', sans-serif", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "white"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          >
            ← Back to events
          </button>

          {/* Event card */}
          <div style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)", overflow: "hidden" }}>
            {/* top color bar */}
            <div style={{ height: "3px", background: `linear-gradient(90deg, ${catColor}, transparent)` }} />
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px", background: "rgba(124,58,237,0.12)", color: catColor, border: `1px solid ${catColor}22` }}>{event.category}</span>
                <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px", background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.2)" }}>● Live</span>
              </div>

              <h1 style={{ fontSize: "22px", fontWeight: 500, lineHeight: 1.3, marginBottom: "12px" }}>{event.title}</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>{event.description || "No description."}</p>

              {[
                { icon: "📅", label: "Date",     value: eventDate },
                { icon: "🏷️", label: "Category", value: event.category },
                { icon: "👥", label: "Capacity",  value: `${event.maxParticipants} seats` },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "16px", width: "24px", textAlign: "center" }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "1px" }}>{value}</div>
                  </div>
                </div>
              ))}

              {/* ── Speakers & Sponsors Dummy Data ── */}
              <div style={{ marginTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "16px" }}>Featured Speakers</h3>
                <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                  {(event.speakers?.length > 0 ? event.speakers : [
                    { name: "John Doe", company: "CEO, EventX", image: "https://i.pravatar.cc/150?img=11" },
                    { name: "Jane Smith", company: "VP Product", image: "https://i.pravatar.cc/150?img=47" },
                  ]).map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.02)", padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
                       <img src={s.image} alt={s.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                       <div>
                         <div style={{ fontSize: "13px", fontWeight: 500 }}>{s.name}</div>
                         <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{s.company}</div>
                       </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "16px" }}>Sponsors</h3>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", opacity: 0.7 }}>
                  {(event.sponsors?.length > 0 ? event.sponsors.map(sp => sp.name) : ["Vercel", "Stripe", "Supabase"]).map(s => (
                    <span key={s} style={{ fontSize: "18px", fontWeight: "bold", fontFamily: "sans-serif", color: "rgba(255,255,255,0.5)" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div style={{ marginTop: "20px", padding: "16px", borderRadius: "12px", background: isPaid ? "rgba(124,58,237,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${isPaid ? "rgba(124,58,237,0.2)" : "rgba(16,185,129,0.2)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Registration fee</span>
                <span style={{ fontSize: "22px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: isPaid ? "white" : "#6ee7b7" }}>
                  {isPaid ? `₹${event.price.toLocaleString()}` : "Free"}
                </span>
              </div>

              {isPaid && (
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "14px" }}>🔒</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Secured by Razorpay · 256-bit SSL</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Form ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Complete your registration</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, margin: "0 0 28px", lineHeight: 1.15 }}>
            {isPaid ? "Register & pay" : "Register for free"}
          </h2>

          <Steps current={step} />

          <AnimatePresence mode="wait">

            {/* ── Step 1 ── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <FormField label="Full name" required>
                  <input style={inputStyle} value={userName} readOnly onFocus={onFocus} onBlur={onBlur} />
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", marginTop: "5px" }}>Pre-filled from your account</p>
                </FormField>
                <FormField label="Email address" required>
                  <input style={inputStyle} value={userEmail} readOnly onFocus={onFocus} onBlur={onBlur} />
                </FormField>
                <FormField label="Phone number">
                  <input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" type="tel" onFocus={onFocus} onBlur={onBlur} />
                </FormField>
                <FormField label="College / Organisation">
                  <input style={inputStyle} value={form.organisation} onChange={e => set("organisation", e.target.value)} placeholder="e.g. VIT-AP University" onFocus={onFocus} onBlur={onBlur} />
                </FormField>
              </motion.div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <FormField label="Participation type" required>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {[{ val: "solo", icon: "👤", label: "Solo", desc: "Register as individual" }, { val: "team", icon: "👥", label: "Team", desc: "Register with a team" }].map(({ val, icon, label, desc }) => {
                      const active = partType === val;
                      return (
                        <motion.div key={val} whileTap={{ scale: 0.97 }} onClick={() => setPartType(val)}
                          style={{ flex: 1, padding: "16px", borderRadius: "12px", cursor: "pointer", border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`, background: active ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                          <div style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</div>
                          <div style={{ color: active ? "#c4b5fd" : "white", fontSize: "15px", fontWeight: 500, marginBottom: "3px" }}>{label}</div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{desc}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </FormField>

                <AnimatePresence>
                  {partType === "team" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                      <FormField label="Team name" required>
                        <input style={inputStyle} value={form.teamName} onChange={e => set("teamName", e.target.value)} placeholder="e.g. The Innovators" onFocus={onFocus} onBlur={onBlur} />
                      </FormField>
                      <FormField label="Team members">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {teamMembers.map((m, i) => (
                            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input style={{ ...inputStyle, flex: 1 }} value={m} onChange={e => updateMember(i, e.target.value)} placeholder={`Member ${i + 1} name`} onFocus={onFocus} onBlur={onBlur} />
                              {teamMembers.length > 1 && (
                                <button onClick={() => removeMember(i)} style={{ width: "36px", height: "36px", flexShrink: 0, borderRadius: "8px", border: "none", background: "rgba(239,68,68,0.1)", color: "#fca5a5", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                              )}
                            </div>
                          ))}
                          {teamMembers.length < 8 && (
                            <button onClick={addMember} style={{ padding: "9px 14px", borderRadius: "9px", border: "1px dashed rgba(124,58,237,0.35)", background: "transparent", color: "#a78bfa", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", transition: "all 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >+ Add team member</button>
                          )}
                        </div>
                      </FormField>
                    </motion.div>
                  )}
                </AnimatePresence>

                <FormField label="Notes / requirements">
                  <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Dietary restrictions, accessibility needs, or questions…" onFocus={onFocus} onBlur={onBlur} />
                </FormField>
              </motion.div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "20px", lineHeight: 1.65 }}>
                  Review your details before {isPaid ? "proceeding to payment" : "confirming registration"}.
                </p>

                <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "20px" }}>
                  {[
                    { label: "Name",          value: userName },
                    { label: "Email",         value: userEmail },
                    { label: "Phone",         value: form.phone || "—" },
                    { label: "Organisation",  value: form.organisation || "—" },
                    { label: "Participation", value: partType === "team" ? "Team" : "Solo" },
                    ...(partType === "team" ? [
                      { label: "Team name", value: form.teamName || "—" },
                      { label: "Members",   value: teamMembers.filter(m => m.trim()).join(", ") || "—" },
                    ] : []),
                    { label: "Notes", value: form.notes || "—" },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label} style={{ display: "flex", gap: "16px", padding: "12px 16px", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", width: "120px", flexShrink: 0 }}>{label}</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", wordBreak: "break-word" }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Price summary */}
                <div style={{ padding: "16px 20px", borderRadius: "12px", background: isPaid ? "rgba(124,58,237,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${isPaid ? "rgba(124,58,237,0.2)" : "rgba(16,185,129,0.2)"}`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Amount due</span>
                  <span style={{ fontSize: "24px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: isPaid ? "white" : "#6ee7b7" }}>
                    {isPaid ? `₹${event.price.toLocaleString()}` : "Free"}
                  </span>
                </div>

                {isPaid && (
                  <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <img src="https://razorpay.com/favicon.ico" alt="Razorpay" style={{ width: "18px", height: "18px", borderRadius: "3px" }} />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>Powered by Razorpay · Encrypted &amp; secure payment</span>
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ padding: "12px 14px", borderRadius: "10px", marginBottom: "16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "13px", lineHeight: 1.5 }}>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            {step > 1 && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setStep(s => s - 1); setError(""); }}
                style={{ padding: "13px 22px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ← Back
              </motion.button>
            )}

            <motion.button
              whileHover={!submitting ? { scale: 1.02 } : {}}
              whileTap={!submitting ? { scale: 0.97 } : {}}
              onClick={step < 3 ? () => setStep(s => s + 1) : handleConfirm}
              disabled={submitting}
              style={{
                flex: 1, padding: "13px 24px", borderRadius: "10px", border: "none",
                fontSize: "14px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                cursor: submitting ? "not-allowed" : "pointer",
                background: submitting ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                color: "white",
                boxShadow: submitting ? "none" : "0 0 28px rgba(124,58,237,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {submitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                  Processing…
                </>
              ) : step < 3 ? (
                "Continue →"
              ) : isPaid ? (
                `Pay ₹${event.price.toLocaleString()} →`
              ) : (
                "Confirm registration ✓"
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          .reg-grid { grid-template-columns: 1fr !important; padding-top: 80px !important; }
        }
      `}</style>
    </div>
  );
}
