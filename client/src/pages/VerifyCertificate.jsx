import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certId, setCertId] = useState(id || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // If ID is in URL, auto-verify
  useEffect(() => {
    if (id) {
      handleVerify(id);
    }
  }, [id]);

  const handleVerify = async (searchId) => {
    const targetId = searchId || certId;
    if (!targetId) return;

    setLoading(true);
    setResult(null);
    setError(null);

    // Optional: auto-format EVX-
    let formattedId = targetId.toUpperCase();
    if (!formattedId.startsWith("EVX-")) {
      formattedId = "EVX-" + formattedId;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/certificate/verify/${formattedId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid or missing certificate");
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "120px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.1))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(124,58,237,0.3)", boxShadow: "0 0 30px rgba(124,58,237,0.2)" }}>
             <span style={{ fontSize: "32px" }}>🛡️</span>
          </div>
          <h1 style={{ fontSize: "40px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, margin: "0 0 16px" }}>Verify Certificate</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", marginBottom: "40px" }}>
            Enter the unique Certificate ID located at the bottom of the document to verify its authenticity.
          </p>

          {!id && (
            <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
              <input 
                type="text" 
                placeholder="EVX-XXXXX" 
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                style={{ flex: 1, padding: "16px 24px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", fontSize: "16px", outline: "none" }}
              />
              <button 
                onClick={() => handleVerify()}
                disabled={loading}
                style={{ padding: "0 32px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "24px", borderRadius: "24px" }}
            >
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>❌</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "20px" }}>Verification Failed</h3>
              <p style={{ margin: 0, fontSize: "15px" }}>{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", padding: "40px", borderRadius: "32px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: -50, left: -50, width: "150px", height: "150px", background: "#10b981", filter: "blur(100px)", opacity: 0.2 }} />
              
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "white", fontSize: "24px", boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}>
                ✓
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: "24px", color: "#34d399" }}>Official Record Confirmed</h3>
              <p style={{ margin: "0 0 32px", fontSize: "15px", color: "rgba(255,255,255,0.6)" }}>This certificate is valid and recognized by EventX.</p>

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "24px", textAlign: "left", display: "grid", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Participant</div>
                  <div style={{ fontSize: "18px", fontWeight: 500 }}>{result.user?.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Event Completed</div>
                  <div style={{ fontSize: "18px", fontWeight: 500, color: "#a78bfa" }}>{result.event?.title}</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Date</div>
                  <div style={{ fontSize: "16px" }}>{new Date(result.event?.date).toDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Certificate ID</div>
                  <div style={{ fontSize: "16px", fontFamily: "monospace" }}>{result.certificateId}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
