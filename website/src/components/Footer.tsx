import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

import AdSlot from './AdSlot';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--footer-bg)',
      borderTop: '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Footer Global Ad Slot (All Views: Mobile & Desktop) */}
      <div style={{ padding: '1.5rem 2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
        <AdSlot type="banner" slotId="footer-global-ad" />
      </div>

      {/* Giant wordmark background — exactly like ApeChain "APECHAIN" in the footer */}
      <div style={{
        padding: '5rem 0 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Directory columns — positioned above wordmark */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '3rem', paddingBottom: '4rem',
        }}>

          {/* Column 1: Prepare on GotiPrep */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              PREPARE ON GOTIPREP
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'TYPING ARENA', to: '/typing' },
                { label: 'UNSEEN PASSAGE', to: '/passage' },
                { label: 'SENTENCE CLOZE', to: '/sentences' },
                { label: 'EMAIL DRAFTING', to: '/email' },
                { label: 'DASHBOARD', to: '/dashboard' },
              ].map(item => (
                <Link key={item.to} to={item.to} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Community */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              COMMUNITY
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'DISCORD', href: '#' },
                { label: 'TWITTER / X', href: '#' },
                { label: 'TELEGRAM', href: '#' },
              ].map(item => (
                <a key={item.label} href={item.href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: GotiPrep Platform */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              GOTIPREP
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'OPEN SOURCE', href: 'https://github.com', external: true },
                { label: 'THE BLUEPRINT', href: '#' },
                { label: 'BRAND KIT', href: '#' },
                { label: 'ADMIN LOGIN', href: '/admin', internal: true },
              ].map(item => (
                item.internal ? (
                  <Link key={item.label} to={item.href!} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}>
                    {item.label}
                  </Link>
                ) : item.external ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    transition: 'color 0.2s ease',
                  }}>
                    {item.label} <ExternalLink size={10} style={{ opacity: 0.5 }} />
                  </a>
                ) : (
                  <a key={item.label} href={item.href} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}>
                    {item.label}
                  </a>
                )
              ))}
            </div>
          </div>

        </div>

        {/* Giant GOTIPREP wordmark — ApeChain style */}
        <div style={{
          overflow: 'hidden',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--footer-bg)',
        }}>
          <div style={{
            textAlign: 'center',
            paddingTop: '1rem',
            userSelect: 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(5rem, 15vw, 14rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              color: 'var(--border-color)',
              lineHeight: 0.85,
              display: 'block',
            }}>
              GOTIPREP
            </span>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          padding: '1.5rem 2rem',
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--text-muted)',
          }}>
            © {year} SUVNKR · GOTIPREP
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/terms" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--text-muted)', textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}>
              TERMS OF SERVICE
            </Link>
            <span style={{ color: 'var(--border-color)', fontSize: '0.75rem' }}>|</span>
            <Link to="/privacy" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--text-muted)', textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}>
              PRIVACY NOTICE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
