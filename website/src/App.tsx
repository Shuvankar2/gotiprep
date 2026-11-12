import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import { initAnalytics, trackPageView } from './utils/analytics';

// Eager load Home for instant First Contentful Paint
import Home from './pages/Home';

// Lazy-load secondary routes for performance & Core Web Vitals optimization
const TypingPractice = lazy(() => import('./pages/TypingPractice'));
const PassagePractice = lazy(() => import('./pages/PassagePractice'));
const SentenceCompletion = lazy(() => import('./pages/SentenceCompletion'));
const EmailWriting = lazy(() => import('./pages/EmailWriting'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const AboutGotiPrep = lazy(() => import('./pages/AboutGotiPrep'));

const THEME_KEY = 'gotiprep-theme';

function App() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem(THEME_KEY) || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Initialize Google Analytics / GTM on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track pageviews & scroll to top on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Suspense
        fallback={
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid rgba(0, 84, 250, 0.2)',
                borderTopColor: '#0054fa',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/typing" element={<TypingPractice />} />
          <Route path="/passage" element={<PassagePractice />} />
          <Route path="/sentences" element={<SentenceCompletion />} />
          <Route path="/email" element={<EmailWriting />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/about" element={<AboutGotiPrep />} />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100vh',
                  flexDirection: 'column',
                  gap: '1rem',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                <div style={{ fontSize: '5rem', lineHeight: 1 }}>404</div>
                <h2 className="glow-text-amber" style={{ fontSize: '1.5rem' }}>
                  Page Not Found
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn-primary" style={{ marginTop: '1rem' }}>
                  <span>Back to Home</span>
                </a>
              </div>
            }
          />
        </Routes>
      </Suspense>

      <Footer />
      <CookieConsent />
    </>
  );
}

export default App;
