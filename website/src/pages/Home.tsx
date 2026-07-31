import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';

// ─── RAF Lerp 3D Tilt Hook ─────────────────────────────────────────────────────
function useSmoothTilt(maxDeg = 8, perspective = 1000) {
  const containerRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0, active: false });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const t = targetRef.current.active ? 0.1 : 0.07;
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, t);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, t);
      const { x, y } = currentRef.current;

      // Find inside the active card wrapper to support carousel changes robustly
      const activeCard = el.querySelector('.active-tilt-card');
      const inner = activeCard?.querySelector('.tilt-inner') as HTMLElement | null;
      const glare = activeCard?.querySelector('.tilt-glare') as HTMLElement | null;
      const bg = activeCard?.querySelector('.tilt-bg') as HTMLElement | null;

      if (inner) {
        inner.style.transform = `perspective(${perspective}px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg) scale3d(1.025,1.025,1.025)`;
      }
      if (glare) {
        const gx = (x * 0.5 + 0.5) * 100;
        const gy = (y * 0.5 + 0.5) * 100;
        const op = targetRef.current.active ? Math.sqrt(x * x + y * y) * 0.18 : 0;
        glare.style.opacity = `${op}`;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.28) 0%, transparent 65%)`;
      }
      if (bg) {
        bg.style.transform = `translate(${-x * 10}px, ${-y * 10}px) scale(1.08)`;
      }

      // Smoothly reset all other cards in the carousel that are not active back to flat
      const otherInners = el.querySelectorAll('.tilt-inner');
      otherInners.forEach((item) => {
        const itemEl = item as HTMLElement;
        const card = itemEl.closest('.active-tilt-card');
        if (!card) {
          itemEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
          const itemBg = itemEl.querySelector('.tilt-bg') as HTMLElement | null;
          if (itemBg) itemBg.style.transform = 'translate(0px, 0px) scale(1.06)';
          const itemGlare = itemEl.querySelector('.tilt-glare') as HTMLElement | null;
          if (itemGlare) itemGlare.style.opacity = '0';
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      targetRef.current.x = ((e.clientX - left) / width - 0.5) * 2;
      targetRef.current.y = ((e.clientY - top) / height - 0.5) * 2;
      targetRef.current.active = true;
    };
    const onLeave = () => { targetRef.current = { x: 0, y: 0, active: false }; };

    el.addEventListener('mousemove', onMove as EventListener);
    el.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mousemove', onMove as EventListener);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [maxDeg, perspective]);

  return containerRef;
}

// ─── Per-card RAF Tilt for grid cards ─────────────────────────────────────────
function attachCardTilts(selector: string, maxDeg = 6) {
  const cards = document.querySelectorAll<HTMLElement>(selector);
  const cleanups: (() => void)[] = [];

  cards.forEach((card) => {
    let raf = 0;
    const target = { x: 0, y: 0, active: false };
    const current = { x: 0, y: 0 };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const t = target.active ? 0.12 : 0.08;
      current.x = lerp(current.x, target.x, t);
      current.y = lerp(current.y, target.y, t);

      const inner = card.querySelector('.tilt-inner') as HTMLElement | null;
      const glare = card.querySelector('.tilt-glare') as HTMLElement | null;
      const bg = card.querySelector('.tilt-bg') as HTMLElement | null;

      if (inner) {
        inner.style.transform = `perspective(700px) rotateX(${-current.y * maxDeg}deg) rotateY(${current.x * maxDeg}deg) scale3d(1.03,1.03,1.03)`;
      }
      if (glare) {
        const gx = (current.x * 0.5 + 0.5) * 100;
        const gy = (current.y * 0.5 + 0.5) * 100;
        const op = target.active ? Math.sqrt(current.x ** 2 + current.y ** 2) * 0.2 : 0;
        glare.style.opacity = `${op}`;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, transparent 60%)`;
      }
      if (bg) {
        bg.style.transform = `translate(${-current.x * 8}px, ${-current.y * 8}px) scale(1.1)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      target.x = ((e.clientX - left) / width - 0.5) * 2;
      target.y = ((e.clientY - top) / height - 0.5) * 2;
      target.active = true;
    };
    const onLeave = () => { target.x = 0; target.y = 0; target.active = false; };

    card.addEventListener('mousemove', onMove as EventListener);
    card.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    cleanups.push(() => {
      card.removeEventListener('mousemove', onMove as EventListener);
      card.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

// ─── Carousel Data ─────────────────────────────────────────────────────────────
const carouselItems = [
  {
    id: 'typing',
    badge: '🔥 HOT',
    categories: 'SPEED, ACCURACY',
    title: 'TYPING ARENA',
    description: 'Real-exam-simulated typing environment on GotiPrep. Backspace Lock, Blind Mode, live WPM metrics.',
    cta: 'LAUNCH',
    to: '/typing',
    bg: '/typing_bg.png',
    accentColor: '#0054fa',
    secondaryColor: '#001a66',
    bgColor: '#030825', // Deep navy base
  },
  {
    id: 'passage',
    badge: '✨ NEW',
    categories: 'READING, COMPREHENSION',
    title: 'UNSEEN PASSAGE',
    description: 'Train critical reading speed and comprehension with randomized passage categories and difficulty levels.',
    cta: 'LAUNCH',
    to: '/passage',
    bg: '/passage_bg.png',
    accentColor: '#00d2ff',
    secondaryColor: '#003344',
    bgColor: '#011220', // Deep teal base
  },
  {
    id: 'sentences',
    badge: '📚 CORE',
    categories: 'GRAMMAR, VOCABULARY',
    title: 'SENTENCE CLOZE',
    description: 'Type-in cloze questions covering grammar, idioms, and banking English with instant feedback.',
    cta: 'LAUNCH',
    to: '/sentences',
    bg: '/sentences_bg.png',
    accentColor: '#8b5cf6',
    secondaryColor: '#3b0764',
    bgColor: '#120422', // Deep purple base
  },
  {
    id: 'email',
    badge: '🤖 AI READY',
    categories: 'WRITING, CORRESPONDENCE',
    title: 'EMAIL DRAFTING',
    description: '12+ real exam prompts. 9-min countdown timer. Word count. Professional tone training.',
    cta: 'LAUNCH',
    to: '/email',
    bg: '/email_bg.png',
    accentColor: '#10b981',
    secondaryColor: '#064e3b',
    bgColor: '#01130d', // Deep emerald base
  },
];

// ─── Apps Grid Data (Exam Practice Modules Only) ────────────────────────────────────────────
const allApps = [
  { id: 'typing',    category: 'SPEED',      title: 'TYPING ARENA',   desc: 'WPM-measured typing drills with exam backspace lock mode.',       to: '/typing',    bg: '/typing_bg.png' },
  { id: 'passage',   category: 'READING',    title: 'UNSEEN PASSAGE', desc: 'Read-and-type comprehension under timed exam conditions.',        to: '/passage',   bg: '/passage_bg.png' },
  { id: 'sentences', category: 'GRAMMAR',    title: 'SENTENCE CLOZE', desc: 'Fill-in-the-blank grammar mastery with instant feedback.',         to: '/sentences', bg: '/sentences_bg.png' },
  { id: 'email',     category: 'WRITING',    title: 'EMAIL DRAFTING', desc: 'Professional correspondence with countdown timer and prompts.',    to: '/email',     bg: '/email_bg.png' },
];

const CATEGORIES = ['ALL', 'SPEED', 'READING', 'GRAMMAR', 'WRITING'];

// ─── 3D coverflow position for each slide ────────────────────────────────────
// Returns CSS transform string for a slide at offset from active (-2 … +2)
function coverflowTransform(offset: number): string {
  if (offset === 0) {
    return 'translateX(0%) rotateY(0deg) scale(1) translateZ(0px)';
  }
  const side = offset < 0 ? -1 : 1;
  const abs = Math.abs(offset);
  // Shift neighbors further out (e.g. ±78%) so they peek out clearly from behind the 55vw active card
  const tx = side * (78 + (abs - 1) * 20);
  // Rotate by 42deg for a gorgeous 3D perspective angle
  const ry = side * Math.min(42 + (abs - 1) * 20, 75);
  // Push back slightly in Z space to create depth layering
  const tz = -150 * abs;
  // Scale down neighbors for coverflow depth
  const sc = Math.max(0.80 - (abs - 1) * 0.1, 0.55);
  return `translateX(${tx}%) rotateY(${ry}deg) scale(${sc}) translateZ(${tz}px)`;
}

// ─── Home Component ───────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live typing simulation for Claude-style visual preview
  const [typedText, setTypedText] = useState('');
  const [wpm, setWpm] = useState(74);
  const sampleText = "GotiPrep fast-tracks exam readiness with real-time WPM metrics, backspace lock drills, comprehension passages, and email correspondence.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= sampleText.length) {
        setTypedText(sampleText.slice(0, index));
        setWpm(Math.floor(68 + Math.sin(index / 4) * 10));
        index++;
      } else {
        index = 0;
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Hero active card tilt — only the center card
  const heroTiltRef = useSmoothTilt(8, 1200) as React.MutableRefObject<HTMLDivElement | null>;

  // Auto-rotate
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goSlide = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselItems.length);
    }, 5000);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const prevSlide = () => goSlide((activeSlide - 1 + carouselItems.length) % carouselItems.length);
  const nextSlide = () => goSlide((activeSlide + 1) % carouselItems.length);

  // Grid card tilts
  useEffect(() => {
    const cleanup = attachCardTilts('.app-card-tilt');
    return cleanup;
  }, [activeTab]);

  // Reveal animations
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-fade-in-up'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [activeTab]);

  const filteredApps = activeTab === 'ALL' ? allApps : allApps.filter(a => a.category === activeTab);
  const current = carouselItems[activeSlide];

  return (
    <div className="page-container landing-page" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <SEO
        title="GotiPrep — Fast-Track Exam Preparation | TCS NQT, Banking, SSC"
        description="Assessment-grade exam preparation platform for TCS NQT, Banking (IBPS/RBI), SSC CGL/CHSL, and Typing Tests. Free, open-source & real-time analytics."
        keywords="typing practice, TCS NQT, IBPS PO, SSC CGL typing test, SSC CHSL typing test, email writing practice, unseen passage practice, sentence completion, WPM test, GotiPrep, SUVNKR"
        path="/"
      />

      {/* Desktop Vertical Skyscraper Gutter Ads */}
      <AdSlot type="vertical-left" />
      <AdSlot type="vertical-right" />

      {/* Mobile Sticky Bottom Bar Ad */}
      <AdSlot type="mobile-sticky" />

      {/* ── SECTION A: FULL-WIDTH 3D COVERFLOW HERO ─── */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Base Colored Background layers cross-fading (Not Black) */}
        {carouselItems.map((item, idx) => (
          <div
            key={`base-bg-${item.id}`}
            style={{
              position: 'absolute', inset: 0,
              background: item.bgColor || '#000000',
              opacity: idx === activeSlide ? 1 : 0,
              transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 0,
            }}
          />
        ))}

        {/* Shifting Colorful Backdrops (Cross-Faded for Performance & Smoothness) */}
        {carouselItems.map((item, idx) => (
          <div
            key={`bg-${item.id}`}
            style={{
              position: 'absolute', inset: 0,
              opacity: idx === activeSlide ? 0.8 : 0,
              backgroundImage: `radial-gradient(circle at 25% 25%, ${item.accentColor}55 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${item.secondaryColor}55 0%, transparent 50%)`,
              filter: 'blur(75px)',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'backdropMorph 25s ease infinite alternate',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Fine grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* ── INFO OVERLAY: left-side text on top of carousel ── */}
        <div style={{
          position: 'absolute', bottom: '3rem', left: '4rem',
          zIndex: 20, maxWidth: '480px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: '#FFFFFF',
            }}>{current.badge}</span>
            <span style={{
              border: '1px solid rgba(255,255,255,0.3)', padding: '3px 10px', borderRadius: '100px',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.85)',
            }}>{current.categories}</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4.5vw, 5rem)',
            fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.0,
            letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '1rem',
            textShadow: '0 4px 40px rgba(0,0,0,0.8)',
          }}>
            {current.title}
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
            letterSpacing: '0.07em', lineHeight: 1.6,
            marginBottom: '1.5rem', maxWidth: '420px',
          }}>{current.description}</p>

          <Link to={current.to} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            padding: '12px 28px', background: '#FFFFFF', color: '#000000',
            border: 'none', borderRadius: '100px', textDecoration: 'none',
            boxShadow: '0 0 30px rgba(255,255,255,0.4)',
            transition: 'all 0.3s ease',
          }}>
            {current.cta}
          </Link>
        </div>

        {/* ── 3D COVERFLOW STAGE ── */}
        {/* Outer clip region — clips the sides */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          overflow: 'hidden',
        }}>
          {/* Inner stage — wider so neighbors can exist outside without clipping perspective */}
          <div
            ref={heroTiltRef as React.RefObject<HTMLDivElement>}
            style={{
              position: 'absolute',
              top: 0, bottom: 0,
              left: '-50%', right: '-50%',
              perspective: '1100px',
              perspectiveOrigin: '50% 46%',
            }}
          >
          {carouselItems.map((item, idx) => {
            const offset = idx - activeSlide;
            // Wrap offset so carousel is circular
            let wrappedOffset = offset;
            const n = carouselItems.length;
            if (wrappedOffset > n / 2) wrappedOffset -= n;
            if (wrappedOffset < -n / 2) wrappedOffset += n;

            const isActive = wrappedOffset === 0;
            // Only render ±2 from active
            if (Math.abs(wrappedOffset) > 2) return null;

            const opacity = isActive ? 1 : Math.max(0.35 - (Math.abs(wrappedOffset) - 1) * 0.1, 0.2);
            const zIndex = isActive ? 5 : 4 - Math.abs(wrappedOffset);

            return (
              <div
                key={item.id}
                className={`coverflow-card ${isActive ? "active-tilt-card" : ""}`}
                style={{
                  position: 'absolute',
                  // 16:9 card on desktop, 4:3 on mobile portrait
                  width: '55vw',
                  aspectRatio: '16 / 9',
                  // Position within the inner stage: top/left 50% of inner = viewport center
                  top: '50%',
                  left: '50%',
                  // center + coverflow offset
                  transform: `translate(-50%, -50%) ${coverflowTransform(wrappedOffset)}`,
                  transformStyle: 'preserve-3d',
                  // Transition transform along easeOutExpo curve for circular revolving feel
                  transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
                  opacity,
                  zIndex,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  // Shadow on active
                  boxShadow: isActive
                    ? '0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)'
                    : '0 20px 60px rgba(0,0,0,0.6)',
                }}
                onClick={isActive ? undefined : () => goSlide(idx)}
              >
                {/* tilt-inner — only on active card does the RAF tilt apply */}
                <div
                  className="tilt-inner"
                  style={{
                    position: 'absolute', inset: 0,
                    transformStyle: 'preserve-3d',
                    willChange: isActive ? 'transform' : 'auto',
                  }}
                >
                  {/* If active slide is typing (slide 0), display Claude-style live typing preview overlay on top of bg */}
                  {item.id === 'typing' ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'rgba(10,11,16,0.92)' }}>
                      <div style={{ height: '36px', background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 14px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
                          GOTIPREP LIVE EXAM SIMULATOR
                        </span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#00d2ff', fontWeight: 700 }}>
                            {wpm} WPM
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>
                            99.4% ACC
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '1rem', lineHeight: 1.6, color: '#FFFFFF' }}>
                        <div>
                          <span>{typedText}</span>
                          <span style={{ display: 'inline-block', width: '3px', height: '1.1em', background: '#0054fa', marginLeft: '3px', verticalAlign: 'middle', animation: 'heroBgFade 0.6s infinite' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ flex: 1, background: 'rgba(0,84,250,0.15)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,84,250,0.3)' }}>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>EXAM MODE</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>BACKSPACE LOCKED 🔒</div>
                          </div>
                          <div style={{ flex: 1, background: 'rgba(0,210,255,0.15)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,210,255,0.3)' }}>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>LIVE COUNTDOWN</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00d2ff' }}>09:54 REMAINING ⏱️</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="tilt-bg"
                      style={{
                        position: 'absolute', inset: '-6%',
                        backgroundImage: `url(${item.bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        willChange: isActive ? 'transform' : 'auto',
                        filter: isActive ? 'none' : 'brightness(0.6) saturate(0.7)',
                      }}
                    />
                  )}

                  {/* Overlay gradient — stronger on non-active */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isActive
                      ? 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.05) 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%)',
                  }} />

                  {/* Keyframe for bg fade on slide change + backdrop morphing */}
          <style>{`
            @keyframes heroBgFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes backdropMorph {
              0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
              50% { transform: translate(50px, -30px) rotate(3deg) scale(1.06); }
              100% { transform: translate(-25px, 25px) rotate(-3deg) scale(0.96); }
            }
          `}</style>
                  {/* Glare — only on active */}
                  {isActive && (
                    <div
                      className="tilt-glare"
                      style={{
                        position: 'absolute', inset: 0,
                        opacity: 0, pointerEvents: 'none',
                        mixBlendMode: 'screen',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          </div>{/* end inner stage */}
        </div>{/* end outer stage */}

        {/* ── RIGHT: Arrows + Thumbnail dock ── */}
        <div style={{
          position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 30,
        }}>
          <button onClick={nextSlide} style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.6)',
            color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(12px)', transition: 'all 0.25s ease',
          }}>
            <ChevronRight size={20} />
          </button>
          <button onClick={prevSlide} style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.6)',
            color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(12px)', transition: 'all 0.25s ease',
          }}>
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* ── BOTTOM RIGHT: SEE ALL + Thumbnails ── */}
        <div style={{
          position: 'absolute', bottom: '2rem', right: '2rem',
          zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
              SEE ALL MODULES
            </span>
            <ChevronRight size={12} color="rgba(255,255,255,0.45)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {carouselItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => goSlide(idx)}
                style={{
                  width: idx === activeSlide ? 38 : 30,
                  height: idx === activeSlide ? 38 : 30,
                  borderRadius: '8px',
                  border: idx === activeSlide ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.2)',
                  background: '#111',
                  backgroundImage: item.bg ? `url(${item.bg})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: idx === activeSlide ? '0 0 20px rgba(255,255,255,0.7)' : 'none',
                  padding: 0, flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .coverflow-card {
              width: 88vw !important;
              aspect-ratio: 4 / 3 !important;
            }
            .coverflow-info { bottom: 1.5rem !important; left: 1.5rem !important; max-width: 90vw !important; }
          }
        `}</style>
      </section>

      {/* Leaderboard Ad below Hero & above Spotlight Heading */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        <AdSlot type="leaderboard" slotId="home-hero-bottom-ad" />
      </div>

      {/* ── SECTION B: SPOTLIGHT ─────────────────────────── */}
      <section className="reveal" style={{
        padding: '7rem 0', borderBottom: '1px solid var(--border-color)',
        position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Column: Text & CTAs */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                {['GOTIPREP', 'SPOTLIGHT'].map((label, i) => (
                  <div key={label} style={{
                    border: '1px solid var(--border-color)',
                    background: i === 1 ? 'var(--text-primary)' : 'transparent',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: i === 1 ? 'var(--bg-primary)' : 'var(--text-primary)',
                  }}>{label}</div>
                ))}
              </div>

              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
                fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.0,
                letterSpacing: '-0.02em', color: 'var(--text-primary)',
                marginBottom: '2rem',
              }}>
                WHERE PRACTICE<br />SHINES &<br />YOU WIN
              </h2>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                GotiPrep practice is broken down into targeted rounds — each one specifically tailored to sharpen a critical exam skill. This ensures you're building real mastery, not just familiarity.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                Crush daily WPM targets, unlock XP streaks, and score epic achievement badges at each milestone. Top performers earn shareable rank certificates for LinkedIn and X.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2.5rem', fontWeight: 600 }}>
                Simple, fast, elite. Ready to make your mark? ⚡✨
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/typing" style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  padding: '14px 28px', background: 'var(--text-primary)', color: 'var(--bg-primary)',
                  border: 'none', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.3s ease',
                }}>GET STARTED</Link>
                <a href="#modules" style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  padding: '13px 28px', background: 'transparent', color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.3s ease',
                }}>GO PRACTICE</a>
              </div>
            </div>

            {/* Right Column: Video / Live Typing Simulator Demo Box */}
            <div style={{
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.3s ease',
            }}>
              {/* Window Bar */}
              <div style={{
                height: '36px', background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', padding: '0 14px',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  TYPING SIMULATOR DEMO
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#0054fa', fontWeight: 700 }}>
                    {wpm} WPM
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>
                    99.4% ACC
                  </span>
                </div>
              </div>

              {/* Typing Body */}
              <div style={{
                padding: '2rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)', fontSize: '0.95rem', lineHeight: 1.6,
                color: 'var(--text-primary)',
              }}>
                <div>
                  <span>{typedText}</span>
                  <span style={{ display: 'inline-block', width: '3px', height: '1.1em', background: '#0054fa', marginLeft: '3px', verticalAlign: 'middle', animation: 'heroBgFade 0.6s infinite' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
                  <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>MODE</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>BACKSPACE LOCK 🔒</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>TIMER</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0054fa' }}>09:54 LEFT ⏱️</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION C: MODULES GRID (EXAM PRACTICE MODULES ONLY) ──────────────────────── */}
      <section id="modules" style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>🚀</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                GOTIPREP MODULES
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {CATEGORIES.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '6px 14px', borderRadius: '100px',
                border: activeTab === tab ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                background: activeTab === tab ? 'var(--text-primary)' : 'transparent',
                color: activeTab === tab ? 'var(--bg-primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}>{tab}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            border: '1px solid var(--border-color)',
            borderRadius: '4px', overflow: 'hidden',
          }}>
            {filteredApps.map((app, i) => (
              <Link
                key={app.id}
                to={app.to}
                className="app-card-tilt reveal"
                style={{
                  display: 'block', position: 'relative',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  transformStyle: 'preserve-3d',
                  textDecoration: 'none',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="tilt-inner" style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', willChange: 'transform' }}>
                  <div className="tilt-bg" style={{
                    position: 'absolute', inset: '-5%',
                    backgroundImage: app.bg ? `url(${app.bg})` : 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    willChange: 'transform',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.08) 100%)' }} />
                  <div className="tilt-glare" style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none', mixBlendMode: 'screen' }} />
                  <div style={{ position: 'absolute', inset: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                    <span style={{
                      display: 'inline-block', border: '1px solid rgba(255,255,255,0.25)',
                      background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '100px',
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
                      width: 'fit-content',
                    }}>{app.category}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', lineHeight: 1.0, letterSpacing: '-0.01em', marginBottom: '6px' }}>
                        {app.title}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>
                        {app.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Banner Ad */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        <AdSlot type="banner" slotId="home-footer-ad" />
      </div>

      {/* ── SECTION D: SCROLLING TICKER ──────────────────── */}
      <section style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', overflow: 'hidden', padding: '20px 0', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', gap: '3rem', animation: 'marquee 18s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(3)].flatMap(() => ['TYPING SPEED', 'GRAMMAR', 'COMPREHENSION', 'WRITING', 'EXAM MASTERY', 'ACCURACY', 'WPM', 'CLOZE TEST', 'EMAIL DRAFTING', 'STREAK']).map((item, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {item} <span style={{ color: 'var(--border-color)', marginLeft: '1.5rem' }}>•</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        `}</style>
      </section>

    </div>
  );
};

export default Home;
