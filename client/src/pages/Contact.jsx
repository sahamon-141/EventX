import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", inquiry: "general", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "80px", alignItems: "start" }}>
        
        {/* Left Side */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: "64px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", margin: "0 0 24px", fontWeight: 400 }}>Get in touch</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", lineHeight: 1.6, marginBottom: "40px", maxWidth: "400px" }}>
            Whether you have a question about features, trials, pricing, need a demo, or anything else, our team is ready to answer all your questions.
          </p>

          <div style={{ display: "grid", gap: "32px", marginBottom: "40px" }}>
            <div>
              <h4 style={{ fontSize: "16px", color: "#a78bfa", marginBottom: "8px" }}>Headquarters</h4>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>123 EventX Boulevard<br/>San Francisco, CA 94107<br/>United States</p>
            </div>
            <div>
              <h4 style={{ fontSize: "16px", color: "#a78bfa", marginBottom: "8px" }}>Direct Contact</h4>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>support@eventx.com<br/>+1 (555) 123-4567</p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>𝕏</div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>in</div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>IG</div>
          </div>
        </motion.div>

        {/* Right Side / Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "40px", backdropFilter: "blur(20px)" }}
        >
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", margin: "0 auto 24px" }}>✓</div>
              <h3 style={{ fontSize: "24px", margin: "0 0 16px" }}>Message Sent!</h3>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                style={{ marginTop: "24px", padding: "12px 24px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "white", cursor: "pointer" }}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Name</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Inquiry Type</label>
                <select value={form.inquiry} onChange={e => setForm({...form, inquiry: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", outline: "none", boxSizing: "border-box" }}>
                  <option value="general">General Support</option>
                  <option value="sales">Sales & Enterprise</option>
                  <option value="billing">Billing Issue</option>
                  <option value="partnership">Partnerships</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Message</label>
                <textarea required rows="5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ marginTop: "16px", padding: "16px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", fontWeight: 600, fontSize: "16px", cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
