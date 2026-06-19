import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentFailure() {
  const { eventId } = useParams();
  const location = useLocation();
  const errorMessage = location.state?.error || "Your transaction could not be completed.";

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f", color: "white",
      fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          maxWidth: "480px", width: "100%", padding: "40px",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "24px", textAlign: "center", position: "relative", overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "200px", height: "200px", background: "radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)", pointerEvents: "none"
        }} />

        <div style={{
          width: "64px", height: "64px", borderRadius: "50%", background: "rgba(239,68,68,0.15)",
          border: "2px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "32px",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
        }}>
          ✕
        </div>

        <h1 style={{ fontSize: "28px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "12px", color: "white" }}>
          Payment Failed
        </h1>
        
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
          {errorMessage}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link to={`/register/${eventId}`} style={{
            textDecoration: "none", padding: "14px", borderRadius: "12px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "white", fontSize: "15px", fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
          }}>
            ← Try Again
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
