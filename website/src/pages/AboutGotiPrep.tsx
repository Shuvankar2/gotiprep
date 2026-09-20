import React from 'react';
import { ExternalLink, Github, Zap, BookOpen, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';

const features = [
  {
    icon: <Zap size={20} />,
    title: 'Typing Arena',
    desc: 'Exam-simulated environment with WPM tracking, accuracy metrics, backspace lock, and blind mode for SSC, CHSL, and steno-level speed drills.',
    accent: '#0054fa',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Unseen Passages',
    desc: 'Comprehension practice with varied difficulty levels — every passage is evaluated with automatic MCQ scoring to mirror real exam conditions.',
    accent: '#00d2ff',
  },
  {
    icon: <Target size={20} />,
    title: 'Sentence Cloze',
    desc: 'Fill-in-the-blank grammar drills drawn from real SSC and banking exam question banks — build vocabulary and contextual understanding.',
    accent: '#a78bfa',
  },
  {
    icon: <Heart size={20} />,
    title: 'Email Drafting',
    desc: 'Formal email writing prompts that train structured communication — vital for descriptive section of CGL Tier-III and CHSL.',
    accent: '#34d399',
  },
];

const AboutGotiPrep: React.FC = () => {
  return (
    <div className="page-container">
      <SEO
        title="About GotiPrep — Your Free SSC & Exam Prep Platform"
        description="GotiPrep is a free, open-source exam preparation platform offering Typing Arena, Unseen Passage, Sentence Cloze, and Email Drafting for SSC, CHSL, and banking aspirants."
        keywords="about GotiPrep, SSC exam prep, free typing practice, open source exam platform, GotiPrep story"
        path="/about"
      />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>

        <AdSlot type="banner" slotId="about-top-ad" style={{ marginBottom: '2rem' }} />

        {/* Hero Header */}
        <div style={{ marginBottom: '3.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--text-muted)', marginBottom: '1rem',
          }}>
            ABOUT THE PLATFORM
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}>
            <span className="glow-text-amber">Goti</span>Prep
          </h1>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.75,
            maxWidth: '620px', fontFamily: 'var(--font-body)',
          }}>
            GotiPrep is a <strong>free, open-source exam preparation platform</strong> built specifically for
            SSC, CHSL, banking, and government exam aspirants in India. From typing speed drills to formal email
            writing — every module is engineered to mirror the actual exam experience.
          </p>
        </div>

        {/* Mission Card */}
        <div className="card-glow" style={{ padding: '2.5rem', marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--text-muted)', marginBottom: '1rem',
          }}>
            THE MISSION
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8,
            fontFamily: 'var(--font-body)', margin: 0,
          }}>
            Millions of students preparing for government exams in India lack access to quality, exam-accurate
            practice tools — especially for typing tests and descriptive writing. GotiPrep exists to bridge that gap:
            a completely free platform, zero login required, no data harvested. Just practice, built right.
          </p>
        </div>

        {/* Features Grid */}
        <h2 style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'var(--text-muted)', marginBottom: '1.5rem',
        }}>
          WHAT WE OFFER
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}>
          {features.map((f) => (
            <div
              key={f.title}
              className="card-glow"
              style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  background: `${f.accent}15`,
                  border: `1px solid ${f.accent}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.accent, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--text-primary)', margin: 0,
                }}>
                  {f.title}
                </h3>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                color: 'var(--text-muted)', lineHeight: 1.6, margin: 0,
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Open Source Section */}
        <div className="card-glow" style={{
          padding: '2.5rem', borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.06) 0%, var(--bg-card) 100%)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#34d399', flexShrink: 0,
            }}>
              <Github size={22} />
            </div>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <h2 style={{
                fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-primary)', marginBottom: '0.6rem',
              }}>
                Open Source
              </h2>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7,
                fontFamily: 'var(--font-body)', marginBottom: '1.25rem',
              }}>
                GotiPrep is fully open source. Browse the code, report issues, suggest features,
                or contribute directly on GitHub. Community contributions are always welcome.
              </p>
              <a
                href="https://github.com/Shuvankar2/gotiprep"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '0.65rem 1.4rem' }}
              >
                <span>View on GitHub</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Creator */}
        <div className="card-glow" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--text-muted)', marginBottom: '0.75rem',
          }}>
            BUILT BY
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="https://shuvankar.qzz.io" target="_blank" rel="noopener noreferrer" title="SUVNKR Portfolio" style={{ display: 'flex' }}>
              <img
                src="/Logo-Color3D.svg"
                alt="SUVNKR Logo"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  objectFit: 'contain',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  padding: '4px',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            </a>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800,
                color: 'var(--text-primary)', letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                Shuvankar Debnath
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  fontWeight: 700, letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  padding: '2px 6px', borderRadius: '4px',
                }}>
                  SUVNKR
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                <a
                  href="https://shuvankar.qzz.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'var(--text-accent)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  Portfolio <ExternalLink size={10} />
                </a>
                <a
                  href="https://github.com/Shuvankar2"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  GitHub <ExternalLink size={10} />
                </a>
                <a
                  href="https://x.com/suvnkrr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  Twitter/X <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav */}
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
        }}>
          <Link to="/sitemap" style={{ color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            → Sitemap
          </Link>
          <Link to="/typing" style={{ color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            → Typing Arena
          </Link>
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            → Terms
          </Link>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            → Privacy
          </Link>
        </div>

        <AdSlot type="banner" slotId="about-bottom-ad" style={{ marginTop: '3rem' }} />
      </div>
    </div>
  );
};

export default AboutGotiPrep;
