import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All");
  
  const tags = ["All", "Guides", "Case Studies", "Product News", "Marketing"];
  
  const posts = [
    { title: "10 Secrets to Selling Out Your Tech Conference", tag: "Marketing", date: "Oct 12, 2026", readTime: "5 min", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80" },
    { title: "EventX 2.0: The Ultimate Event OS is Here", tag: "Product News", date: "Sep 28, 2026", readTime: "3 min", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80" },
    { title: "How Web3 Startups use EventX to Host Hackathons", tag: "Case Studies", date: "Sep 15, 2026", readTime: "8 min", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80" },
    { title: "A Complete Guide to Verifiable Certificates", tag: "Guides", date: "Sep 02, 2026", readTime: "6 min", img: "https://images.unsplash.com/photo-1589330694653-beeaca59b2fe?w=500&q=80" },
    { title: "Maximizing Sponsorships: What Brands Want", tag: "Marketing", date: "Aug 20, 2026", readTime: "4 min", img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&q=80" },
    { title: "Introducing Organizer Public Profiles", tag: "Product News", date: "Aug 05, 2026", readTime: "2 min", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80" },
  ];

  const filtered = activeTag === "All" ? posts : posts.filter(p => p.tag === activeTag);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "white", padding: "120px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ color: "#7c3aed", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Resources & Insights</p>
          <h1 style={{ fontSize: "56px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", margin: "0 0 24px", fontWeight: 400 }}>The EventX Blog</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>Learn how to host better events, market them effectively, and grow your community.</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "60px" }}>
          {tags.map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{ padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", background: tag === activeTag ? "white" : "transparent", color: tag === activeTag ? "black" : "white", cursor: "pointer", transition: "all 0.3s", fontSize: "14px", fontWeight: 500 }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "32px" }}>
          {filtered.map((post, i) => (
            <motion.div 
              key={post.title}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
            >
              <div style={{ height: "200px", overflow: "hidden" }}>
                 <img src={post.img} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
              </div>
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", color: "#a78bfa", background: "rgba(124,58,237,0.1)", padding: "4px 12px", borderRadius: "100px" }}>{post.tag}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{post.readTime} read</span>
                </div>
                <h3 style={{ fontSize: "24px", margin: "0 0 16px", lineHeight: 1.4 }}>{post.title}</h3>
                <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                   <span>{post.date}</span>
                   <span style={{ color: "white" }}>Read article →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ marginTop: "100px", padding: "60px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", margin: "0 0 16px" }}>Subscribe to our newsletter</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>Get the latest news, event tips, and resources delivered weekly.</p>
          <div style={{ display: "flex", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
            <input type="email" placeholder="Email address" style={{ flex: 1, padding: "16px 24px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", outline: "none" }} />
            <button style={{ padding: "0 32px", borderRadius: "100px", background: "white", color: "black", fontWeight: 600, border: "none", cursor: "pointer" }}>Subscribe</button>
          </div>
        </div>

      </div>
    </div>
  );
}
