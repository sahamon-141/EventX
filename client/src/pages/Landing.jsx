import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

// ─── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 18);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// ─── 3D Hover Ticket Card ──────────────────────────────────────────────────────
function TicketCard({ delay, title, date, category, x, y, rotate }) {
  const xRotate = useMotionValue(0);
  const yRotate = useMotionValue(0);
  const springX = useSpring(xRotate, { stiffness: 300, damping: 20 });
  const springY = useSpring(yRotate, { stiffness: 300, damping: 20 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    xRotate.set((mouseY / height - 0.5) * -30); // Rotate max 15deg
    yRotate.set((mouseX / width - 0.5) * 30);
  }

  function handleMouseLeave() {
    xRotate.set(0);
    yRotate.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        left: x, top: y,
        position: "absolute",
        perspective: 1000, // 3D perspective
        zIndex: 10,
        pointerEvents: "auto"
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          width: "220px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "18px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          cursor: "default",
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", transform: "translateZ(30px)" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(251,191,36,0.9)", background: "rgba(251,191,36,0.1)", padding: "4px 8px", borderRadius: "8px" }}>
            {category}
          </span>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }} />
        </div>
        <p style={{ color: "white", fontSize: "14px", fontWeight: 500, lineHeight: 1.4, marginBottom: "8px", transform: "translateZ(40px)" }}>{title}</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", transform: "translateZ(20px)" }}>{date}</p>
        <div style={{ marginTop: "16px", display: "flex", gap: "4px", transform: "translateZ(10px)" }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Feature pill ──────────────────────────────────────────────────────────────
function FeaturePill({ icon, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.4)", color: "white" }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 20px",
        borderRadius: "100px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.6)",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}

// ─── Step card ─────────────────────────────────────────────────────────────────
function StepCard({ step, title, body, accent, delay }) {
  const xRotate = useMotionValue(0);
  const yRotate = useMotionValue(0);
  const springX = useSpring(xRotate, { stiffness: 300, damping: 30 });
  const springY = useSpring(yRotate, { stiffness: 300, damping: 30 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    xRotate.set(-y / 15);
    yRotate.set(x / 15);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { xRotate.set(0); yRotate.set(0); setIsHovered(false); }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      style={{
        position: "relative",
        borderRadius: "32px",
        padding: "48px 40px",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
        boxShadow: isHovered ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.2)` : "0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        transformStyle: "preserve-3d",
        perspective: 1200,
        height: "100%",
        rotateX: springX,
        rotateY: springY,
        cursor: "pointer",
      }}
    >
      {/* Animated Gradient Border */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0.4 }}
        style={{
          position: "absolute", inset: 0, borderRadius: "32px",
          padding: "2px",
          background: `linear-gradient(135deg, ${accent}80, transparent 40%, transparent 60%, ${accent}40)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />

      {/* Dynamic Glow orb inside card */}
      <motion.div 
        animate={{ scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1], opacity: isHovered ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ position: "absolute", top: -80, right: -80, width: "250px", height: "250px", background: accent, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} 
      />
      
      <motion.span 
        style={{
          display: "inline-block",
          fontSize: "72px",
          lineHeight: 1,
          marginBottom: "36px",
          color: "white",
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontWeight: 400,
          opacity: 0.9,
          transform: "translateZ(30px)",
          textShadow: isHovered ? `0 0 30px ${accent}` : "none",
          transition: "text-shadow 0.3s ease",
        }}
      >
        <span style={{ color: accent, background: `linear-gradient(135deg, white, ${accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {step}
        </span>
      </motion.span>
      
      <div style={{ transform: "translateZ(40px)" }}>
        <h3 style={{ color: "white", fontSize: "24px", fontWeight: 500, marginBottom: "16px", letterSpacing: "-0.5px" }}>{title}</h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.7 }}>{body}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        transition={{ duration: 0.3 }}
        style={{ transform: "translateZ(20px)", marginTop: "32px", display: "flex", alignItems: "center", gap: "8px", color: accent, fontWeight: 500, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}
      >
        <span>Explore phase</span>
        <span>→</span>
      </motion.div>

    </motion.div>
  );
}

// ─── Main Landing component ────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Mouse Parallax logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse coordinates
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  // Map mouse coordinates to orb translations
  const orb1X = useTransform(smoothX, [0, window.innerWidth], [-50, 50]);
  const orb1Y = useTransform(smoothY, [0, window.innerHeight], [-50, 50]);
  const orb2X = useTransform(smoothX, [0, window.innerWidth], [60, -60]);
  const orb2Y = useTransform(smoothY, [0, window.innerHeight], [60, -60]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: "#07070f",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >

      {/* ── Grain texture ─────────────────────────────────────────────────────── */}
      <div style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 1,
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px",
      }} />

      {/* ── Interactive Ambient lights ────────────────────────────────────────── */}
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <motion.div style={{
          position: "absolute", width: "80vw", height: "80vw", borderRadius: "50%",
          top: "-40%", left: "-20%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 60%)",
          x: orb1X, y: orb1Y
        }} />
        <motion.div style={{
          position: "absolute", width: "60vw", height: "60vw", borderRadius: "50%",
          top: "10%", right: "-10%",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 60%)",
          x: orb2X, y: orb2Y
        }} />
      </div>

      {/* ── Floating ticket cards (desktop only) ──────────────────────────────── */}
      <div className="hidden lg:block" style={{ position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none" }}>
        <TicketCard delay={1.0} title="React Summit 2025" date="Dec 14, 2025" category="Tech" x="3%" y="15%" rotate={-8} />
        <TicketCard delay={1.2} title="Design Systems Workshop" date="Jan 08, 2026" category="Workshop" x="78%" y="10%" rotate={6} />
        
        {/* Adjusted coordinates from y:60% and x:73% to prevent overlap with feature section */}
        <TicketCard delay={1.4} title="AI & ML Seminar" date="Feb 02, 2026" category="Seminar" x="84%" y="42%" rotate={-5} />
        
        <TicketCard delay={1.1} title="Startup Sports Day" date="Mar 01, 2026" category="Sports" x="2%" y="45%" rotate={5} />
        
        {/* Added 4 more floating items throughout the extremely long page */}
        <TicketCard delay={1.5} title="Next.js Conf" date="May 10, 2026" category="Tech" x="5%" y="78%" rotate={-10} />
        <TicketCard delay={1.3} title="Global FinTech" date="Jul 22, 2026" category="Seminar" x="80%" y="82%" rotate={12} />
        
        {/* Decorative Floating Blobs/Avatars */}
        <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "35%", left: "15%", fontSize: "80px", filter: "drop-shadow(0 20px 30px rgba(124,58,237,0.3))" }}>✨</motion.div>
        <motion.div animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "25%", right: "12%", fontSize: "60px", filter: "drop-shadow(0 20px 30px rgba(79,70,229,0.3))" }}>🚀</motion.div>
        <motion.div animate={{ y: [0, -40, 0], rotate: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "65%", right: "8%", fontSize: "70px", filter: "drop-shadow(0 20px 30px rgba(16,185,129,0.3))" }}>🎉</motion.div>
        <motion.div animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "85%", left: "8%", fontSize: "50px", filter: "drop-shadow(0 20px 30px rgba(245,158,11,0.3))" }}>🔥</motion.div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 10 }}
      >
        <div style={{
          display: "flex", flex: 1, height: "110vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
        }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              marginBottom: "32px", display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "6px 18px", borderRadius: "100px",
              border: "1px solid rgba(139,92,246,0.3)",
              background: "rgba(139,92,246,0.1)",
              boxShadow: "0 0 20px rgba(139,92,246,0.2) inset"
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", animation: "pulse 2s infinite", boxShadow: "0 0 10px #a78bfa" }} />
            <span style={{ color: "#c4b5fd", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              The Ultimate Event OS
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.1, type: "spring", stiffness: 50 }}
            style={{
              maxWidth: "900px",
              fontSize: "clamp(50px, 8vw, 100px)",
              color: "white",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontWeight: 400,
              margin: 0,
            }}
          >
            The{" "}
            <span style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              background: "linear-gradient(to right, #c4b5fd, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              paddingRight: "8px"
            }}>
              intelligent
            </span>{" "}
            way to host your events
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              marginTop: "32px",
              maxWidth: "540px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            From ticketing and payments to automated PDF certificates. EventX manages the entire lifecycle effortlessly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ marginTop: "48px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(124,58,237,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              style={{
                position: "relative", padding: "16px 40px", borderRadius: "100px",
                fontSize: "15px", fontWeight: 600, color: "white", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                boxShadow: "0 0 20px rgba(124,58,237,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px"
              }}
            >
              Get started free →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/events")}
              style={{
                padding: "16px 40px", borderRadius: "100px",
                fontSize: "15px", fontWeight: 500, color: "white",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer", backdropFilter: "blur(12px)", fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.3s",
              }}
            >
              Browse events
            </motion.button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: "48px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", maxWidth: "800px" }}
          >
            <FeaturePill icon="🎟️" label="Smart Ticketing" delay={0.7} />
            <FeaturePill icon="💳" label="Razorpay Payments" delay={0.8} />
            <FeaturePill icon="📜" label="Auto PDF Certificates" delay={0.9} />
            <FeaturePill icon="📧" label="Email Invoices" delay={1.0} />
          </motion.div>

        </div>
      </motion.div>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto", padding: "0 24px 120px" }}
      >
        <div style={{
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(0,0,0,0.4)"
        }}>
          {/* top shimmer line */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { value: 1200, suffix: "+", label: "Events hosted" },
              { value: 48000, suffix: "+", label: "Registrations" },
              { value: 99, suffix: "%", label: "Satisfaction" },
            ].map(({ value, suffix, label }, i) => (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  padding: "40px 16px",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div style={{
                  fontSize: "clamp(32px, 5vw, 48px)",
                  color: "white",
                  marginBottom: "8px",
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #fff, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  <Counter to={value} suffix={suffix} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 24px 160px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "70px" }}
        >
          <p style={{ color: "#a78bfa", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px", fontWeight: 600 }}>
            The Process
          </p>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 56px)", color: "white",
            fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, margin: 0,
          }}>
            Three steps to a perfect event
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <StepCard step="01" title="Create & Launch" accent="#7c3aed" delay={0.1} body="Set the title, date, pricing, and capacity. Your event goes live globally instantly." />
          <StepCard step="02" title="Manage Registrations" accent="#4f46e5" delay={0.3} body="Attendees sign up and pay via Razorpay. Capacity limits, invoices, and emails are fully automated." />
          <StepCard step="03" title="Generate Certificates" accent="#d97706" delay={0.5} body="Once the event completes, attendees are instantly emailed their personalized PDF certificate." />
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 10, maxWidth: "1000px", margin: "0 auto", padding: "0 24px 160px" }}
      >
        <div style={{
          position: "relative", borderRadius: "32px", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)", padding: "100px 32px", textAlign: "center",
          background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(79,70,229,0.05) 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Animated glow inside CTA */}
          <motion.div
            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", top: "-50%", left: "-10%", width: "120%", height: "200%", background: "conic-gradient(from 0deg, transparent 0%, rgba(124,58,237,0.1) 20%, transparent 40%)", opacity: 0.5, pointerEvents: "none" }}
          />

          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "white", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, marginBottom: "24px", position: "relative", zIndex: 2 }}>
            Ready to scale your next event?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 48px", position: "relative", zIndex: 2 }}>
            Join thousands of modern organizers who trust EventX for end-to-end event management.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124,58,237,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            style={{
              position: "relative", zIndex: 2, padding: "18px 48px", borderRadius: "100px",
              fontSize: "16px", fontWeight: 600, color: "white", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px"
            }}
          >
            Create your account →
          </motion.button>
        </div>
      </motion.section>

    </div>
  );
}
