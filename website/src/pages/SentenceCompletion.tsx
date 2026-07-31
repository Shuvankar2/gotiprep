import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { CheckCircle, XCircle, RotateCcw, ChevronRight, ArrowRight } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

type SessionState = 'intro' | 'practice' | 'result';

interface Answer { id: string; userAnswer: string; correct: boolean; }

const SentenceCompletion: React.FC = () => {
  const { sentences } = useAdminStore();
  const [category, setCategory] = useState<string>('all');
  const [sessionState, setSessionState] = useState<SessionState>('intro');
  const [sessionItems, setSessionItems] = useState(sentences.slice(0, 10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const categories = ['all', 'grammar', 'vocabulary', 'idioms', 'banking', 'general'];
  const categoryColors: Record<string, string> = {
    grammar: '#34d399', vocabulary: '#b06fd6', idioms: '#ED9E59', banking: '#60a5fa', general: '#f87171', all: '#E5C2C2'
  };

  const startSession = () => {
    const pool = category === 'all' ? sentences : sentences.filter((s) => s.category === category);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionItems(shuffled);
    setCurrentIdx(0);
    setAnswers([]);
    setUserInput('');
    setShowFeedback(false);
    setSessionState('practice');
  };

  const currentItem = sessionItems[currentIdx];

  const checkAnswer = () => {
    if (!currentItem) return;
    const trimmed = userInput.trim().toLowerCase();
    const correct = trimmed === currentItem.blank.toLowerCase() ||
      trimmed.includes(currentItem.blank.toLowerCase());
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswers((prev) => [...prev, { id: currentItem.id, userAnswer: userInput, correct }]);
  };

  const nextQuestion = () => {
    setUserInput('');
    setShowFeedback(false);
    if (currentIdx + 1 >= sessionItems.length) {
      setSessionState('result');
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const totalCorrect = answers.filter((a) => a.correct).length;
  const progress = sessionItems.length > 0 ? ((currentIdx) / sessionItems.length) * 100 : 0;

  return (
    <div className="page-container">
      <SEO
        title="Sentence Completion & Cloze Test Practice — Banking, SSC | GotiPrep"
        description="Practice sentence cloze and fill-in-the-blanks grammar & vocabulary exercises tailored for IBPS PO, SBI Clerk, and SSC CGL exams with instant feedback."
        keywords="sentence completion practice, cloze test practice online free, IBPS PO cloze test, SSC CGL English vocabulary, GotiPrep"
        path="/sentences"
      />

      {/* Mobile Sticky Bottom Bar Ad */}
      <AdSlot type="mobile-sticky" />

      <div className="layout-with-side-ads">
        <AdSlot type="vertical-left" />
        <div className="layout-main-content" style={{ padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
            <span className="glow-text-coral">Sentence</span> Completion
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the blanks to master vocabulary, grammar, idioms, and banking English.</p>
        </div>

        {/* Intro */}
        {sessionState === 'intro' && (
          <div className="practice-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Category selector */}
              <div className="card-glow" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Choose Category</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {categories.map((c) => (
                    <button key={c} onClick={() => setCategory(c)} style={{
                      padding: '8px 18px', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                      border: category === c ? `1px solid ${categoryColors[c]}` : '1px solid var(--border-color)',
                      background: category === c ? `${categoryColors[c]}20` : 'transparent',
                      color: category === c ? categoryColors[c] : 'var(--text-muted)',
                      transition: 'all 0.2s',
                    }}>
                      {c === 'all' ? '✨ All Categories' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session info */}
              <div className="card-glow" style={{ padding: '1.5rem', background: 'rgba(237,158,89,0.05)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--goti-amber)' }}>Session Details</h4>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--goti-amber)' }}>10</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: '#b06fd6' }}>{(category === 'all' ? sentences : sentences.filter((s) => s.category === category)).length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Pool</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: '#34d399' }}>∞</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attempts</div>
                  </div>
                </div>
              </div>

              <button className="btn-primary animate-glow-pulse" onClick={startSession} style={{ fontSize: '1rem', padding: '14px 32px', alignSelf: 'flex-start' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Start Session <ArrowRight size={18} />
                </span>
              </button>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card-glow" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--goti-amber)', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>📝 How it works</h4>
                {['Type the missing word to complete each sentence', 'Instant feedback after each answer', 'Detailed explanation shown for every item', 'Score and review at the end of the session'].map((t) => (
                  <p key={t} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '8px', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--goti-amber)', flexShrink: 0 }}>→</span> {t}
                  </p>
                ))}
              </div>
              <AdSlot type="sidebar" slotId="sentences-sidebar-ad" />
            </div>
          </div>
        )}

        {/* Practice */}
        {sessionState === 'practice' && currentItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {sessionItems.length}</span>
              <span className={`badge badge-${currentItem.category === 'banking' ? 'green' : 'amber'}`}>
                {currentItem.category}
              </span>
            </div>
            <div className="progress-bar" style={{ marginBottom: '8px' }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Question Card */}
            <div className="card-glow" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Fill in the blank
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '1.15rem', lineHeight: 1.8,
                  color: 'var(--text-primary)', fontWeight: 500,
                  letterSpacing: '0.01em',
                }}>
                  {currentItem.sentence.split('_____').map((part, idx) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx < currentItem.sentence.split('_____').length - 1 && (
                        <span style={{
                          display: 'inline-block', minWidth: '100px', borderBottom: `2px solid var(--goti-amber)`,
                          margin: '0 4px', color: showFeedback ? (isCorrect ? '#34d399' : '#f87171') : 'var(--goti-amber)',
                          textShadow: showFeedback ? '' : '0 0 10px rgba(237,158,89,0.4)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {showFeedback ? (isCorrect ? userInput : currentItem.blank) : (userInput || '\u00A0')}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Hint:</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{currentItem.hint}</div>
              </div>

              {!showFeedback && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    autoFocus
                    className="form-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && userInput.trim()) checkAnswer(); }}
                    placeholder="Type your answer…"
                    style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                  />
                  <button className="btn-primary" onClick={checkAnswer} disabled={!userInput.trim()}>
                    <span>Check</span>
                  </button>
                </div>
              )}

              {/* Feedback */}
              {showFeedback && (
                <div className="animate-fade-in" style={{
                  padding: '1.25rem', borderRadius: '12px', marginTop: '0',
                  background: isCorrect ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                  border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {isCorrect ? <CheckCircle size={20} style={{ color: '#34d399' }} /> : <XCircle size={20} style={{ color: '#f87171' }} />}
                    <span style={{ fontWeight: 700, color: isCorrect ? '#34d399' : '#f87171', fontSize: '1rem' }}>
                      {isCorrect ? 'Correct! 🎉' : `Incorrect. The answer is "${currentItem.blank}"`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    💡 {currentItem.explanation}
                  </p>
                  <button className="btn-primary" onClick={nextQuestion} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {currentIdx + 1 >= sessionItems.length ? 'See Results' : 'Next Question'} <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {sessionState === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="result-card animate-fade-in">
              <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                Session Complete! <span className="glow-text-amber">🏆</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Score', value: `${totalCorrect}/${sessionItems.length}`, accent: '#ED9E59' },
                  { label: 'Correct', value: totalCorrect, accent: '#34d399' },
                  { label: 'Incorrect', value: sessionItems.length - totalCorrect, accent: '#f87171' },
                ].map((m) => (
                  <div key={m.label} className="metric-box" style={{ background: 'rgba(13,11,26,0.5)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: m.accent, lineHeight: 1 }}>{m.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Per-question review */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Review:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {sessionItems.map((item, i) => {
                    const ans = answers[i];
                    return (
                      <div key={item.id} style={{
                        padding: '10px 14px', borderRadius: '8px',
                        background: ans?.correct ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                        border: `1px solid ${ans?.correct ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        {ans?.correct ? <CheckCircle size={14} style={{ color: '#34d399', flexShrink: 0 }} /> : <XCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.sentence.replace('_____', `[${item.blank}]`)}
                          </span>
                          {!ans?.correct && <span style={{ fontSize: '0.75rem', color: '#f87171' }}>Your answer: {ans?.userAnswer || '(blank)'}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AdSlot type="banner" slotId="sentences-result-ad" style={{ marginBottom: '1rem', borderRadius: '10px' }} />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={startSession}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RotateCcw size={16} /> Try Again</span></button>
                <button className="btn-secondary" onClick={() => setSessionState('intro')}>Change Category</button>
              </div>
            </div>
          </div>
        )}
        </div>
        <AdSlot type="vertical-right" />
      </div>
    </div>
  );
};

export default SentenceCompletion;
