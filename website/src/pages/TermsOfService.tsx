import React from 'react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';

const TermsOfService: React.FC = () => {
  return (
    <div className="page-container">
      <SEO
        title="Terms of Service — GotiPrep Exam Readiness Platform"
        description="GotiPrep Terms of Service: Guidelines, user agreement, and platform policies for using our free assessment-grade examination preparation tools."
        keywords="terms of service, GotiPrep user agreement, terms and conditions, platform policy"
        path="/terms"
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        
        {/* Banner Ad above Heading */}
        <AdSlot type="banner" slotId="terms-top-banner-ad" style={{ marginBottom: '2rem' }} />

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '8px' }}>
            <span className="glow-text-amber">Terms</span> of Service
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            Last Updated: July 31, 2026
          </p>
        </div>

        {/* Legal Document Content */}
        <div className="card-glow" style={{ padding: '2.5rem', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong>GotiPrep</strong> (gotiprep.shuvankar.qzz.io), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              2. Educational Purpose & Use License
            </h2>
            <p>
              GotiPrep is an open-source, assessment-grade examination preparation platform designed for students preparing for competitive exams (such as TCS NQT, Banking IBPS/RBI, and SSC CGL/CHSL). Permission is granted to temporarily use the practice simulators (Typing Arena, Unseen Passage, Sentence Cloze, and Email Simulator) for personal, non-commercial educational practice.
            </p>
            <p style={{ marginTop: '0.5rem' }}>Under this license, you may not:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Use the materials for any commercial monetization or unauthorized re-branding;</li>
              <li>Attempt to decompile or reverse engineer any security algorithms on the site;</li>
              <li>Remove any copyright, trademark, or open-source attribution notices;</li>
              <li>Use automated scripts or bots to flood practice servers or manipulate leaderboards.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              3. Disclaimer of Warranties
            </h2>
            <p>
              The materials and practice simulators on GotiPrep are provided on an 'as is' and 'as available' basis. GotiPrep makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular examination standard, or non-infringement of intellectual property.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              4. Limitations of Liability
            </h2>
            <p>
              In no event shall GotiPrep, its maintainers, or contributors be liable for any damages (including, without limitation, damages for loss of data, exam scores, or business interruption) arising out of the use or inability to use the materials on GotiPrep, even if notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              5. Advertisements & Third-Party Links
            </h2>
            <p>
              GotiPrep displays third-party advertisements served by Google AdSense. GotiPrep has not reviewed all of the external sites linked to its platform or ads and is not responsible for the contents of any such linked site. The inclusion of any link or ad does not imply endorsement by GotiPrep.
            </p>
          </section>

          <section style={{ marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              6. Modifications to Terms
            </h2>
            <p>
              GotiPrep may revise these Terms of Service at any time without prior notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.
            </p>
          </section>

        </div>

        {/* Bottom Banner Ad before Footer */}
        <AdSlot type="banner" slotId="terms-bottom-banner-ad" style={{ marginTop: '2.5rem' }} />

      </div>
    </div>
  );
};

export default TermsOfService;
