import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: isAnnual ? "0" : "0",
      description: "Perfect for testing the waters and small personal events.",
      features: ["Up to 50 attendees per event", "Standard email templates", "Basic event page", "EventX Watermark on Certificates"],
      cta: "Get Started Free",
      accent: "#a8a29e", // grey
      gradient: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      popular: false
    },
    {
      name: "Pro",
      price: isAnnual ? "15" : "19",
      description: "Everything you need to run professional, scaled events.",
      features: ["Unlimited attendees", "Custom Certificates (No Watermark)", "Advanced Email Customization", "Priority Support"],
      cta: "Upgrade to Pro",
      accent: "#7c3aed", // primary purple
      gradient: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.05) 100%)",
      popular: true
    },
    {
      name: "Max",
      price: isAnnual ? "49" : "59",
      description: "Advanced analytics and custom domains for power users.",
      features: ["Everything in Pro", "Advanced Revenue Analytics", "Custom Domain names", "Dedicated Account Manager", "API Access"],
      cta: "Upgrade to Max",
      accent: "#ec4899", // pink
      gradient: "linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(219,39,119,0.05) 100%)",
      popular: false
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "120px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(40px, 5vw, 64px)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginBottom: "16px", fontWeight: 400 }}
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "0 auto 40px" }}
          >
            No hidden fees. No surprise charges. Only pay for what you need to make your next event a massive success.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", borderRadius: "100px", padding: "6px", alignItems: "center" }}
          >
            <button 
              onClick={() => setIsAnnual(false)}
              style={{ padding: "10px 24px", borderRadius: "100px", border: "none", background: !isAnnual ? "rgba(255,255,255,0.1)" : "transparent", color: !isAnnual ? "white" : "rgba(255,255,255,0.5)", fontWeight: !isAnnual ? 600 : 400, cursor: "pointer", transition: "all 0.3s" }}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              style={{ padding: "10px 24px", borderRadius: "100px", border: "none", background: isAnnual ? "rgba(255,255,255,0.1)" : "transparent", color: isAnnual ? "white" : "rgba(255,255,255,0.5)", fontWeight: isAnnual ? 600 : 400, cursor: "pointer", transition: "all 0.3s" }}
            >
              Annually <span style={{ color: "#10b981", fontSize: "12px", marginLeft: "6px" }}>Save 20%</span>
            </button>
          </motion.div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
              whileHover={{ y: -10 }}
              style={{
                flex: "1 1 320px",
                maxWidth: "380px",
                borderRadius: "32px",
                padding: "40px",
                position: "relative",
                background: plan.gradient,
                border: plan.popular ? `1px solid ${plan.accent}80` : "1px solid rgba(255,255,255,0.05)",
                boxShadow: plan.popular ? `0 20px 40px ${plan.accent}20` : "none",
                backdropFilter: "blur(20px)",
                display: "flex", flexDirection: "column"
              }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", background: `linear-gradient(135deg, ${plan.accent}, #4f46e5)`, color: "white", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", boxShadow: `0 0 20px ${plan.accent}80` }}>
                  Most Popular
                </div>
              )}
              
              <h3 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 16px" }}>{plan.name}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.5, margin: "0 0 32px", minHeight: "45px" }}>{plan.description}</p>
              
              <div style={{ marginBottom: "32px" }}>
                <span style={{ fontSize: "48px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>${plan.price}</span>
                <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}> /mo</span>
              </div>

              <div style={{ flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: `${plan.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", color: plan.accent, fontSize: "12px" }}>✓</div>
                    <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                style={{
                  marginTop: "40px",
                  padding: "16px", width: "100%", borderRadius: "16px",
                  border: "none", fontWeight: 600, fontSize: "16px", cursor: "pointer",
                  background: plan.popular ? `linear-gradient(135deg, ${plan.accent}, #4f46e5)` : "rgba(255,255,255,0.1)",
                  color: "white",
                  transition: "background 0.3s"
                }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
