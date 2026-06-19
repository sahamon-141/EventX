import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Help() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Attendees");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = ["Attendees", "Organizers", "Billing", "Certificates"];
  
  const faqs = [
    { category: "Attendees", q: "How do I access my event tickets?", a: "Once registered, your tickets are available in your Dashboard. You'll also receive an email confirmation with a direct link to your ticket." },
    { category: "Attendees", q: "Can I cancel or transfer my registration?", a: "Yes, you can cancel your registration from the Dashboard up to 24 hours before the event starts. Transfers must be requested by contacting the organizer directly." },
    { category: "Organizers", q: "How do I set up a paid event?", a: "When creating an event, enter a price greater than 0. Ensure you have configured your Razorpay API keys in the platform settings to accept payments." },
    { category: "Organizers", q: "Are there any fees for free events?", a: "No! EventX is completely free to use for hosting free events. We only charge a small processing fee for paid tickets." },
    { category: "Billing", q: "What payment methods are supported?", a: "Through our integration with Razorpay, we support all major Credit/Debit cards, UPI, Wallets, and NetBanking." },
    { category: "Certificates", q: "How do I verify a certificate?", a: "Go to the Verify page (eventx.com/verify) and enter the unique EVX- code found at the bottom of the certificate." },
  ];

  const filteredFaqs = faqs.filter(f => 
    (search ? f.q.toLowerCase().includes(search.toLowerCase()) : f.category === activeCategory)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "120px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header Search */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "56px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", margin: "0 0 24px", fontWeight: 400 }}>How can we help?</h1>
          <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
            <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "rgba(255,255,255,0.4)" }}>⌕</span>
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "20px 20px 20px 60px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Categories */}
        {!search && (
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenFaq(null); }}
                style={{ padding: "10px 24px", borderRadius: "100px", border: "none", background: cat === activeCategory ? "white" : "rgba(255,255,255,0.05)", color: cat === activeCategory ? "black" : "white", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredFaqs.length === 0 ? (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>No results found for "{search}"</p>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{ width: "100%", padding: "24px", background: "none", border: "none", color: "white", textAlign: "left", fontSize: "18px", fontWeight: 500, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {faq.q}
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} style={{ color: "#7c3aed" }}>▼</motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 24px 24px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Contact Support */}
        <div style={{ marginTop: "80px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "60px" }}>
          <h3 style={{ fontSize: "24px", margin: "0 0 16px" }}>Still need help?</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>Our support team is available 24/7 to assist you.</p>
          <a href="/contact" style={{ display: "inline-block", padding: "12px 32px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", textDecoration: "none", borderRadius: "100px", fontWeight: 600 }}>Contact Support</a>
        </div>

      </div>
    </div>
  );
}
