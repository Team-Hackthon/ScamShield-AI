import "./App.css";

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Analyzer from "./components/Analyzer";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import About from "./components/About.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Terms from "./Pages/Terms.jsx";
import Team from "./Pages/Team.jsx";

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Analyzer />
        <HowItWorks />
        <About/>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="app">

      <div className="cyber-background" aria-hidden="true">
        <span className="cyber-dot dot-1"></span>
        <span className="cyber-dot dot-2"></span>
        <span className="cyber-dot dot-3"></span>
        <span className="cyber-dot dot-4"></span>
        <span className="cyber-dot dot-5"></span>
        <span className="cyber-dot dot-6"></span>

        <span className="floating-shield shield-1">♢</span>
        <span className="floating-shield shield-2">♢</span>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/team" element={<Team />} />
      </Routes>

    </div>
  );
}

export default App;