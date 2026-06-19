import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Profile from "./pages/Profile";
import EventCommunity from "./pages/EventCommunity";
import Pricing from "./pages/Pricing";
import OrganizerProfile from "./pages/OrganizerProfile";
import VerifyCertificate from "./pages/VerifyCertificate";
import About from "./pages/About";
import Integrations from "./pages/Integrations";
import Help from "./pages/Help";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import EventLanding from "./pages/EventLanding";
import EventGallery from "./pages/EventGallery";
import EventTimeline from "./pages/EventTimeline";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.3, ease: "easeIn" } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/register/:eventId" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/payment-success/:eventId" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
        <Route path="/payment-failure/:eventId" element={<PageWrapper><PaymentFailure /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/community/:eventId" element={<PageWrapper><EventCommunity /></PageWrapper>} />
        <Route path="/gallery/:id" element={<PageWrapper><EventGallery /></PageWrapper>} />
        <Route path="/timeline/:id" element={<PageWrapper><EventTimeline /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
        <Route path="/organizer/:id" element={<PageWrapper><OrganizerProfile /></PageWrapper>} />
        <Route path="/verify/:id?" element={<PageWrapper><VerifyCertificate /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/integrations" element={<PageWrapper><Integrations /></PageWrapper>} />
        <Route path="/help" element={<PageWrapper><Help /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/event-details/:id" element={<PageWrapper><EventLanding /></PageWrapper>} />
        <Route
          path="*"
          element={
            <PageWrapper>
              <div style={{
                height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "#07070f", color: "white", flexDirection: "column", gap: "16px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <div style={{ fontSize: "80px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#7c3aed" }}>404</div>
                <p style={{ color: "rgba(255,255,255,0.35)" }}>Page not found.</p>
                <a href="/" style={{ color: "#a78bfa", fontSize: "14px" }}>← Go back home</a>
              </div>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
