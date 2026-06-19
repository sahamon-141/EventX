import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";

// ─── Achievement Badge Component ──────────────────────────────────────────────
function Achievement({ icon, title, description, unlocked, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
      style={{
        background: unlocked ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)",
        border: unlocked ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.05)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        filter: unlocked ? "none" : "grayscale(100%)",
        opacity: unlocked ? 1 : 0.5,
        boxShadow: unlocked ? "0 10px 30px rgba(124,58,237,0.2)" : "none",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {unlocked && (
        <motion.div 
          animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "#7c3aed", filter: "blur(40px)", opacity: 0.4 }} 
        />
      )}
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: unlocked ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{description}</div>
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [Stats, setStats] = useState({ registered: 0, attended: 0, hosted: 0 });
  const [form, setForm] = useState({ name: "", phone: "", organization: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    const fetchData = async () => {
      try {
        const [profileRes, regsRes] = await Promise.all([
          axios.get(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/registrations/my`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setUser(profileRes.data);
        setForm({
          name: profileRes.data.name || "",
          phone: profileRes.data.phone || "",
          organization: profileRes.data.organization || ""
        });

        const regs = regsRes.data;
        setStats({
          registered: regs.length,
          attended: regs.filter(r => r.attendance).length,
          hosted: 0
        });

      } catch (err) {
        console.error("Error fetching profile data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: "success", text: "Settings secured. Profile updated! ✨" });
      
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.name = form.name;
        localStorage.setItem("user", JSON.stringify(storedUser));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#07070f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 40, height: 40, border: "3px solid rgba(124,58,237,0.3)", borderTopColor: "#7c3aed", borderRadius: "50%" }} />
      </div>
    );
  }

  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "40px" }}>
        
        {/* LEFT COLUMN: IDENTIFY AND ACHIEVEMENTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{
               position: "relative",
               background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
               border: "1px solid rgba(255,255,255,0.05)",
               borderRadius: "32px",
               padding: "40px",
               backdropFilter: "blur(20px)",
               textAlign: "center",
               overflow: "hidden"
            }}
          >
            {/* Animated Grid Background inside Card */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.5 }} />

            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{
                width: "120px", height: "120px", borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "48px", fontWeight: "bold", color: "white",
                boxShadow: "0 20px 50px rgba(124,58,237,0.5)",
                margin: "0 auto 24px", position: "relative"
              }}
            >
              {initialLetter}
              <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "24px", height: "24px", background: "#10b981", borderRadius: "50%", border: "4px solid #07070f" }} />
            </motion.div>

            <h1 style={{ margin: 0, color: "white", fontSize: "32px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", position: "relative", zIndex: 2 }}>{user.name}</h1>
            <p style={{ margin: "8px 0 0", color: "#a78bfa", fontSize: "14px", position: "relative", zIndex: 2 }}>{user.email}</p>

            <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "32px", position: "relative", zIndex: 2 }}>
              <div>
                <div style={{ color: "white", fontSize: "24px", fontWeight: 700 }}>{Stats.registered}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase" }}>Registered</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.05)" }} />
              <div>
                <div style={{ color: "white", fontSize: "24px", fontWeight: 700 }}>{Stats.attended}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase" }}>Attended</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 style={{ color: "white", fontSize: "20px", marginBottom: "16px", fontWeight: 500 }}>Achievements</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Achievement delay={0.3} icon="🌱" title="Early Adopter" description="Joined the EventX platform." unlocked={true} />
              <Achievement delay={0.4} icon="🏃‍♂️" title="First Step" description="Attended your first formal event." unlocked={Stats.attended >= 1} />
              <Achievement delay={0.5} icon="🔥" title="Social Butterfly" description="Attended 3+ exciting events." unlocked={Stats.attended >= 3} />
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: SETTINGS FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        >
          <div style={{
             background: "rgba(255,255,255,0.02)",
             border: "1px solid rgba(255,255,255,0.05)",
             borderRadius: "32px",
             padding: "48px 40px",
             backdropFilter: "blur(20px)"
          }}>
            <h2 style={{ margin: "0 0 8px", color: "white", fontSize: "28px", fontWeight: 500 }}>Account Variables</h2>
            <p style={{ margin: "0 0 40px", color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>Customize your public identifier and defaults.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Display Name
                </label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  style={{
                    width: "100%", padding: "16px", borderRadius: "16px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box",
                    transition: "border 0.3s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Phone Number
                </label>
                <input 
                  type="text" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="Set your default phone..."
                  style={{
                    width: "100%", padding: "16px", borderRadius: "16px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box",
                    transition: "border 0.3s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Organization / University
                </label>
                <input 
                  type="text" 
                  value={form.organization} 
                  onChange={e => setForm({...form, organization: e.target.value})}
                  placeholder="Where do you study or work?"
                  style={{
                    width: "100%", padding: "16px", borderRadius: "16px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box",
                    transition: "border 0.3s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              <AnimatePresence>
                {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      padding: "16px", borderRadius: "12px", fontSize: "14px",
                      background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                      color: message.type === "success" ? "#10b981" : "#ef4444",
                      border: `1px solid ${message.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                      fontWeight: 500
                    }}
                  >
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={saving}
                  style={{
                    flex: 1, padding: "16px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: "white", fontWeight: 600, fontSize: "16px",
                    border: "none", cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: "0 10px 20px rgba(124,58,237,0.3)",
                    opacity: saving ? 0.8 : 1, transition: "opacity 0.2s"
                  }}
                >
                  {saving ? "Deploying Updates..." : "Save Preferences"}
                </motion.button>
              </div>

            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
