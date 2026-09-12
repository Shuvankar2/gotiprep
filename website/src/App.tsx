import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import TypingPractice from './pages/TypingPractice';
import PassagePractice from './pages/PassagePractice';
import SentenceCompletion from './pages/SentenceCompletion';
import EmailWriting from './pages/EmailWriting';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

const THEME_KEY = 'gotiprep-theme';

function App() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem(THEME_KEY) || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/typing" element={<TypingPractice />} />
        <Route path="/passage" element={<PassagePractice />} />
        <Route path="/sentences" element={<SentenceCompletion />} />
        <Route path="/email" element={<EmailWriting />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* 404 fallback */}
        <Route path="*" element={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5rem', lineHeight: 1 }}>404</div>
            <h2 className="glow-text-amber" style={{ fontSize: '1.5rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary" style={{ marginTop: '1rem' }}><span>Back to Home</span></a>
          </div>
        } />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
