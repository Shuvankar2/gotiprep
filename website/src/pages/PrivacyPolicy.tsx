import React from 'react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="page-container">
      <SEO
        title="Privacy Policy & Cookie Policy — GotiPrep"
        description="GotiPrep Privacy Policy: Learn how we protect user privacy, store local progress, and comply with Google AdSense data & cookie regulations."
        keywords="privacy policy, GotiPrep privacy notice, cookie policy, Google AdSense privacy compliance"
        path="/privacy"
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        
        {/* Banner Ad above Heading */}
        <AdSlot type="banner" slotId="privacy-top-banner-ad" style={{ marginBottom: '2rem' }} />

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '8px' }}>
            <span className="glow-text-purple">Privacy</span> Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            Last Updated: July 31, 2026
          </p>
        </div>

        {/* Legal Document Content */}
        <div className="card-glow" style={{ padding: '2.5rem', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              1. Overview & Data Privacy Commitment
            </h2>
            <p>
              At <strong>GotiPrep</strong> (gotiprep.shuvankar.qzz.io), accessible from https://gotiprep.shuvankar.qzz.io, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GotiPrep and how we use it.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              2. Local Storage & Practice Data
            </h2>
            <p>
              GotiPrep operates primarily on client-side state architecture. Your typing speed (WPM), test scores, streak counters, and theme preferences are stored locally in your browser's <code>localStorage</code>. GotiPrep does not harvest or sell your personal examination scores to third-party brokers.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              3. Google AdSense & DoubleClick DART Cookies
            </h2>
            <p>
              Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to gotiprep.shuvankar.qzz.io and other sites on the internet.
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to GotiPrep and/or other sites on the Internet.</li>
              <li>Users may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>aboutads.info</a>.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              4. Log Files
            </h2>
            <p>
              GotiPrep follows a standard procedure of using log files provided by host providers (Vercel). The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              5. Children's Privacy
            </h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. GotiPrep does not knowingly collect any Personal Identifiable Information from children under the age of 13.
            </p>
          </section>

          <section style={{ marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              6. Contact Information
            </h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us via our official repository or administrator portal at <a href="https://shuvankar.qzz.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>shuvankar.qzz.io</a>.
            </p>
          </section>

        </div>

        {/* Bottom Banner Ad before Footer */}
        <AdSlot type="banner" slotId="privacy-bottom-banner-ad" style={{ marginTop: '2.5rem' }} />

      </div>
    </div>
  );
};

export default PrivacyPolicy;
