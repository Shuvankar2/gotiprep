import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Clock, Send, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

type SessionState = 'select' | 'writing' | 'result';

const DEFAULT_DURATION = 9 * 60; // 9 minutes
const PAGE_SIZE = 10;

const EmailWriting: React.FC = () => {
  const { emailPrompts } = useAdminStore();
  const [category, setCategory] = useState<string>('all');
  const [selectedPrompt, setSelectedPrompt] = useState(emailPrompts[0]);
  const [sessionState, setSessionState] = useState<SessionState>('select');
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = ['all', 'professional', 'complaint', 'request', 'apology', 'inquiry', 'banking'];
  const categoryColors: Record<string, string> = {
    professional: '#ED9E59', complaint: '#f87171', request: '#60a5fa',
    apology: '#b06fd6', inquiry: '#34d399', banking: '#4ade80', all: '#0054fa'
  };

  const filtered = category === 'all' ? emailPrompts : emailPrompts.filter((e) => e.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedPrompts = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords = 100;
  const isWordCountMet = wordCount >= minWords;

  // Split-flap timer format
  const formatFlap = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return { m, sec };
  };
  const { m, sec } = formatFlap(timeLeft);

  const startSession = (prompt: typeof selectedPrompt) => {
    setSelectedPrompt(prompt);
    setText('');
    setTimeLeft(DEFAULT_DURATION);
    setSubmitted(false);
    setSessionState('writing');
  };

  const startRandomSession = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : emailPrompts;
    const randomPrompt = pool[Math.floor(Math.random() * pool.length)];
    startSession(randomPrompt);
  }, [filtered, emailPrompts]);

  const finishSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSessionState('result');
  }, []);

  useEffect(() => {
    if (sessionState === 'writing' && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { finishSession(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sessionState, submitted, finishSession]);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    setSessionState('result');
  };

  const diffColors: Record<string, string> = { easy: '#34d399', medium: '#ED9E59', hard: '#f87171' };

  return (
    <div className="page-container">
      <SEO
        title="TCS NQT Email Writing Practice Online (9-Min Timer) | GotiPrep"
        description="Timed professional email drafting simulator for TCS NQT and corporate assessment rounds. Includes 9-minute countdown timer, key point checklist & minimum word count verification."
        keywords="TCS NQT email writing practice, TCS email writing simulator online free, corporate email drafting test, timed email practice, GotiPrep"
        path="/email"
      />

      {/* Desktop Vertical Skyscraper Gutter Ads */}
      <AdSlot type="vertical-left" />
      <AdSlot type="vertical-right" />

      {/* Mobile Sticky Bottom Bar Ad */}
      <AdSlot type="mobile-sticky" />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
            <span className="glow-text-amber">Email</span> Writing
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Practice professional email writing within a timed environment. 9 minutes, 100+ words minimum.</p>
        </div>

        {/* Prompt Selection */}
        {sessionState === 'select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Category filter & Random CTA */}
            <div className="card-glow" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Filter by category:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map((c) => (
                    <button key={c} onClick={() => { setCategory(c); setPage(0); }} style={{
                      padding: '6px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      border: category === c ? `1px solid ${categoryColors[c]}` : '1px solid var(--border-color)',
                      background: category === c ? `${categoryColors[c]}20` : 'transparent',
                      color: category === c ? categoryColors[c] : 'var(--text-muted)',
                      transition: 'all 0.2s',
                    }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startRandomSession}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, var(--goti-amber), #3b82f6)',
                  color: '#ffffff', border: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,84,250,0.3)', transition: 'all 0.2s',
                }}
              >
                <Shuffle size={15} /> Select Random & Start
              </button>
            </div>

            <div className="practice-layout">
              {/* Prompt List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pagedPrompts.map((prompt) => (
                  <div key={prompt.id} className="card-glow" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, flex: 1, marginRight: '12px' }}>{prompt.title}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <span className="badge" style={{ background: `${categoryColors[prompt.category]}20`, border: `1px solid ${categoryColors[prompt.category]}40`, color: categoryColors[prompt.category] }}>
                          {prompt.category}
                        </span>
                        <span className="badge" style={{ background: `${diffColors[prompt.difficulty]}20`, border: `1px solid ${diffColors[prompt.difficulty]}40`, color: diffColors[prompt.difficulty] }}>
                          {prompt.difficulty}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {prompt.scenario.substring(0, 200)}…
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                      {prompt.keyPoints.map((kp) => (
                        <span key={kp} style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(0,84,250,0.08)', border: '1px solid rgba(0,84,250,0.2)', borderRadius: '100px', color: 'var(--text-muted)' }}>
                          {kp}
                        </span>
                      ))}
                    </div>
                    <button className="btn-primary" onClick={() => startSession(prompt)} style={{ padding: '9px 22px', fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> Start 9-min Timer</span>
                    </button>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', cursor: page === 0 ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--border-color)', background: 'transparent',
                        color: page === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', opacity: page === 0 ? 0.4 : 1, transition: 'all 0.15s',
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        style={{
                          padding: '7px 13px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600,
                          border: page === i ? '1px solid var(--goti-amber)' : '1px solid var(--border-color)',
                          background: page === i ? 'rgba(0,84,250,0.15)' : 'transparent',
                          color: page === i ? 'var(--goti-amber)' : 'var(--text-secondary)',
                          minWidth: '38px', transition: 'all 0.15s',
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--border-color)', background: 'transparent',
                        color: page === totalPages - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', opacity: page === totalPages - 1 ? 0.4 : 1, transition: 'all 0.15s',
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>

                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      Page {page + 1} of {totalPages} · showing {pagedPrompts.length} of {filtered.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card-glow" style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--goti-amber)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✉️ How it works</h4>
                  {['9-minute countdown timer', '100 words minimum required', 'Professional email format recommended', 'Address all key points in the prompt', 'Subject line + greeting + body + closing'].map((t) => (
                    <p key={t} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '8px', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--goti-amber)', flexShrink: 0 }}>→</span> {t}
                    </p>
                  ))}
                </div>
                <AdSlot type="sidebar" slotId="email-sidebar-ad" />
              </div>
            </div>
          </div>
        )}

        {/* Writing Session */}
        {sessionState === 'writing' && (
          <div className="practice-layout">
            {/* Writing area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Prompt */}
              <div className="card-glow" style={{ padding: '1.5rem', borderColor: 'rgba(0,84,250,0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--goti-amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>📧 Your Prompt</div>
                <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>{selectedPrompt.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
                  {selectedPrompt.scenario}
                </p>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover these key points:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedPrompt.keyPoints.map((kp, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--goti-amber)', flexShrink: 0 }}>{i + 1}.</span> {kp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text area */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your Email:</label>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 700,
                    color: isWordCountMet ? '#34d399' : 'var(--text-muted)',
                  }}>
                    {wordCount}/{minWords} words {isWordCountMet ? '✓' : ''}
                  </span>
                </div>
                <textarea
                  className="form-input form-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Subject: [Your subject line here]\n\nDear [Name],\n\n[Start writing your email here…]\n\nRegards,\n[Your Name]`}
                  rows={16}
                  style={{ minHeight: '400px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical' }}
                  autoFocus
                />
              </div>

              {/* Word count bar */}
              <div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((wordCount / minWords) * 100, 100)}%` }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={!isWordCountMet}
                  style={{ opacity: isWordCountMet ? 1 : 0.5 }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={16} /> Submit Email</span>
                </button>
                <button className="btn-secondary" onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setSessionState('select'); }}>
                  ← Back
                </button>
              </div>
            </div>

            {/* Timer sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Split-flap Timer */}
              <div className="card-glow" style={{
                padding: '1.5rem', textAlign: 'center',
                background: timeLeft < 120 ? 'rgba(248,113,113,0.08)' : 'rgba(0,84,250,0.05)',
                borderColor: timeLeft < 120 ? 'rgba(248,113,113,0.3)' : 'rgba(0,84,250,0.3)',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Time Remaining
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {/* Flap digits with clean matching textShadow */}
                  {[m[0], m[1], ':', sec[0], sec[1]].map((char, i) => (
                    <div key={i} style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: char === ':' ? '2rem' : '3rem',
                      fontWeight: 700,
                      color: timeLeft < 120 ? '#f87171' : 'var(--goti-amber)',
                      textShadow: timeLeft < 120
                        ? '0 0 12px rgba(248,113,113,0.6), 0 0 24px rgba(248,113,113,0.3)'
                        : '0 0 12px rgba(0,84,250,0.5), 0 0 24px rgba(0,84,250,0.25)',
                      lineHeight: 1,
                      ...(char !== ':' ? {
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        border: '1px solid var(--border-color)',
                        minWidth: '52px',
                        display: 'inline-block',
                        textAlign: 'center',
                      } : {}),
                    }}>
                      {char}
                    </div>
                  ))}
                </div>
                {timeLeft < 120 && (
                  <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '10px', fontWeight: 600 }}>
                    ⚠️ Hurry up! Less than 2 minutes left.
                  </p>
                )}
              </div>

              {/* Word count */}
              <div className="card-glow" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: isWordCountMet ? '#34d399' : 'var(--goti-amber)', lineHeight: 1 }}>
                  {wordCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>
                  Words Written
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Min required: {minWords}
                </div>
              </div>

              {/* Key points checklist */}
              <div className="card-glow" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--goti-amber)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Checklist
                </div>
                {selectedPrompt.keyPoints.map((kp, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--goti-amber)' }}>•</span> {kp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {sessionState === 'result' && (
          <div className="card-glow animate-fade-in" style={{ padding: '2rem', textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Submission Complete 🎉</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {isWordCountMet
                ? `Great job! You wrote ${wordCount} words within the time limit.`
                : `Time's up! You wrote ${wordCount} words (${minWords} words required).`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--goti-amber)' }}>{wordCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Total Words</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: '#34d399' }}>
                  {formatFlap(DEFAULT_DURATION - timeLeft).m}:{formatFlap(DEFAULT_DURATION - timeLeft).sec}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Time Taken</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => setSessionState('select')}>
                Try Another Prompt
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmailWriting;
