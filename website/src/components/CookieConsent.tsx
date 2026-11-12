import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const CONSENT_KEY = 'gotiprep_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (!saved) {
        // Small delay so it animates in smoothly without layout shift
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore storage unavailable */
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    }
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      role="region"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '760px',
        zIndex: 10001,
        background: 'rgba(15, 12, 28, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 84, 250, 0.35)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(0, 84, 250, 0.2)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        animation: 'slideUp 0.35s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.15rem' }}>🍪</span>
            <strong style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Cookie &amp; Privacy Preferences
            </strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
            We use essential local storage to save your test scores and preferences. With your consent, we and our partner Google also use cookies to analyze traffic and display relevant advertisements via Google AdSense in compliance with GDPR and CCPA.
            {' '}
            <Link
              to="/privacy"
              style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 500 }}
            >
              Learn more in our Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={handleDecline}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
        >
          Essential Only
        </button>

        <button
          type="button"
          onClick={handleAccept}
          style={{
            background: 'linear-gradient(135deg, #0054fa 0%, #7928ca 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 22px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 84, 250, 0.4)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Accept All
        </button>
      </div>
    </aside>
  );
};

export default CookieConsent;

