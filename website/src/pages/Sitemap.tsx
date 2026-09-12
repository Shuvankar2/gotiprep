import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Map, BookOpen, Type, Shield, Github } from 'lucide-react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';

interface SitemapSection {
  title: string;
  icon: React.ReactNode;
  accent: string;
  links: { label: string; path?: string; href?: string; external?: boolean; description: string }[];
}

const sections: SitemapSection[] = [
  {
    title: 'Practice Modules',
    icon: <Type size={18} />,
    accent: 'var(--goti-amber)',
    links: [
      { label: 'Home', path: '/', description: 'Landing page — feature overview, module cards, hero section' },
      { label: 'Typing Arena', path: '/typing', description: 'Real-exam typing test with WPM, accuracy, backspace lock & blind mode' },
      { label: 'Unseen Passage', path: '/passage', description: 'Comprehension passages with MCQ evaluation and scoring' },
      { label: 'Sentence Cloze', path: '/sentences', description: 'Fill-in-the-blank sentence completion drills' },
      { label: 'Email Drafting', path: '/email', description: 'Formal email writing practice with prompt-based exercises' },
    ],
  },
  {
    title: 'Legal & Policies',
    icon: <Shield size={18} />,
    accent: '#00d2ff',
    links: [
      { label: 'Terms of Service', path: '/terms', description: 'Usage terms, acceptable use, and liability disclaimers' },
      { label: 'Privacy Notice', path: '/privacy', description: 'Data handling, localStorage usage, Google AdSense cookie policy' },
    ],
  },
  {
    title: 'Platform Info',
    icon: <BookOpen size={18} />,
    accent: '#a78bfa',
    links: [
      { label: 'About GotiPrep', path: '/about', description: 'Story, mission, features and the team behind GotiPrep' },
      { label: 'Sitemap', path: '/sitemap', description: 'You are here — full directory of all pages' },
    ],
  },
  {
    title: 'Community & Open Source',
    icon: <Github size={18} />,
    accent: '#34d399',
    links: [
      {
        label: 'GitHub Repository',
        href: 'https://github.com/Shuvankar2/gotiprep',
        external: true,
        description: 'Source code, issues, pull requests and contribution guidelines',
      },
    ],
  },
];

const Sitemap: React.FC = () => {
  return (
    <div className="page-container">
      <SEO
        title="Sitemap — GotiPrep"
        description="Full sitemap of GotiPrep: browse every page including Practice Modules, Legal pages, and Community resources."
        keywords="GotiPrep sitemap, all pages, navigation, site structure"
        path="/sitemap"
      />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>

        <AdSlot type="banner" slotId="sitemap-top-ad" style={{ marginBottom: '2rem' }} />

        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--text-muted)', marginBottom: '1rem',
          }}>
            <Map size={14} />
            PLATFORM DIRECTORY
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}>
            <span className="glow-text-amber">Site</span>map
          </h1>
          <p style={{
            color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6,
            maxWidth: '540px', fontFamily: 'var(--font-body)',
          }}>
            A complete directory of every page on GotiPrep — find your destination fast.
          </p>
        </div>

        {/* Sections Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '2rem',
        }}>
          {sections.map((section) => (
            <div
              key={section.title}
              className="card-glow"
              style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}
            >
              {/* Section Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '1.5rem', paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: `${section.accent}18`,
                  border: `1px solid ${section.accent}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: section.accent,
                }}>
                  {section.icon}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-primary)', margin: 0,
                }}>
                  {section.title}
                </h2>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {section.links.map((link) => (
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <SitemapLinkCard label={link.label} description={link.description} accent={section.accent} external />
                    </a>
                  ) : (
                    <Link key={link.label} to={link.path!} style={{ textDecoration: 'none', display: 'block' }}>
                      <SitemapLinkCard label={link.label} description={link.description} accent={section.accent} />
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        <AdSlot type="banner" slotId="sitemap-bottom-ad" style={{ marginTop: '3rem' }} />
      </div>
    </div>
  );
};

interface LinkCardProps {
  label: string;
  description: string;
  accent: string;
  external?: boolean;
}

const SitemapLinkCard: React.FC<LinkCardProps> = ({ label, description, accent, external }) => (
  <div
    style={{
      padding: '0.85rem 1rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      transition: 'border-color 0.2s ease, background 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = accent;
      (e.currentTarget as HTMLElement).style.background = `${accent}08`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
      (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', color: accent,
      }}>
        {label}
      </span>
      {external && <ExternalLink size={12} style={{ color: accent, opacity: 0.7 }} />}
    </div>
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.8rem',
      color: 'var(--text-muted)', margin: 0, lineHeight: 1.5,
    }}>
      {description}
    </p>
  </div>
);

export default Sitemap;
