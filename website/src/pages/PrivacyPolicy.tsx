import React from 'react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="page-container">
      <SEO
        title="Privacy Policy & Cookie Policy"
        description="GotiPrep Privacy Policy: Learn how we protect user privacy, store local progress, and comply with Google AdSense data & cookie regulations."
        keywords="privacy policy, GotiPrep privacy notice, cookie policy, Google AdSense privacy compliance"
        path="/privacy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
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
              At <strong>GotiPrep</strong> (gotiprep.suvnkr.in), accessible from https://gotiprep.suvnkr.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GotiPrep and how we use it.
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
              3. Google AdSense, DoubleClick DART Cookies & Third-Party Advertising
            </h2>
            <p>
              Google is a third-party vendor on our site. Google uses cookies, including DoubleClick DART cookies, to serve ads to our site visitors based upon their visit to gotiprep.suvnkr.in and other sites across the Internet.
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to GotiPrep and/or other sites on the Internet.</li>
              <li>To understand how Google manages and uses data in its advertising products, please review <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>Google Advertising Technologies Policy</a> and <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>How Google uses information from sites or apps that use our services</a>.</li>
              <li>You may opt-out of personalized advertising at any time by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>aboutads.info</a>.</li>
              <li>For general details on Google's data protection practices, consult the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>Google Privacy Policy</a>.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              4. Cookie Consent Management & User Rights (GDPR & CCPA)
            </h2>
            <p>
              GotiPrep respects your privacy rights and implements Google Consent Mode v2 in accordance with the European Economic Area (EEA), UK GDPR, ePrivacy Directive, and California Consumer Privacy Act (CCPA):
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Essential Cookies:</strong> Strictly necessary for remembering your local theme and examination preferences. These do not track personal identity.</li>
              <li><strong>Analytics & Ad Cookies (Optional):</strong> Used to measure anonymized traffic patterns and deliver relevant Google ads. These cookies are only activated when you provide affirmative consent via our Cookie Consent banner.</li>
              <li><strong>Managing Your Choice:</strong> You can reset or update your cookie preferences at any time by clearing your browser's local storage or cookies for <code>gotiprep.suvnkr.in</code>, which will re-trigger the consent selection.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              5. Log Files
            </h2>
            <p>
              GotiPrep follows a standard procedure of using log files provided by host providers (Vercel). The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              6. Children's Privacy
            </h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. GotiPrep does not knowingly collect any Personal Identifiable Information from children under the age of 13.
            </p>
          </section>

          <section style={{ marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              7. Contact Information
            </h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us via our official repository or administrator portal at <a href="https://suvnkr.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--goti-amber)' }}>suvnkr.in</a>.
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
