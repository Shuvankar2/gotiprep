import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { sentenceItems, SentenceItem } from '../data/sentences';

type SessionState = 'intro' | 'practice' | 'result';

const categoryColors: Record<string, string> = {
  all: '#ed9e59',
  grammar: '#4f8cff',
  vocabulary: '#34d399',
  idioms: '#b06fd6',
  banking: '#f43f5e',
};

const SentenceCompletion: React.FC = () => {
  const [sessionState, setSessionState] = useState<SessionState>('intro');
  const [category, setCategory] = useState<string>('all');
  const [sessionItems, setSessionItems] = useState<SentenceItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);

  const categories = ['all', 'grammar', 'vocabulary', 'idioms', 'banking'];

  const startSession = () => {
    const pool = category === 'all'
      ? [...sentenceItems]
      : sentenceItems.filter((s) => s.category === category);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionItems(shuffled);
    setCurrentIdx(0);
    setUserAnswers([]);
    setCurrentInput('');
    setScore(0);
    setSessionState('practice');
  };

  const handleNext = () => {
    const isCorrect = currentInput.trim().toLowerCase() === currentItem.blank.toLowerCase();
    const newAnswers = [...userAnswers, currentInput.trim()];
    setUserAnswers(newAnswers);
    if (isCorrect) setScore((s) => s + 1);

    if (currentIdx + 1 < sessionItems.length) {
      setCurrentIdx((i) => i + 1);
      setCurrentInput('');
    } else {
      setSessionState('result');
    }
  };

  const currentItem = sessionItems[currentIdx];

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

        {/* Top Banner Ad above Heading */}
        <AdSlot type="banner" slotId="sentences-top-banner-ad" style={{ marginBottom: '1.5rem' }} />

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
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: '#b06fd6' }}>{(category === 'all' ? sentenceItems : sentenceItems.filter((s) => s.category === category)).length}</div>
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
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--goti-amber)', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>📝 Assessment Rules</h4>
                {['Type the missing word to complete each sentence', 'Instant feedback after each answer', 'Detailed explanation shown for every item', 'Score and review at the end of the session'].map((t) => (
                  <p key={t} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '8px', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--goti-amber)', flexShrink: 0 }}>→</span> {t}
                  </p>
                ))}
                {/* 2 Square Ads directly below Assessment Rules */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <AdSlot type="rectangle" slotId="sentences-rule-ad-1" />
                  <AdSlot type="rectangle" slotId="sentences-rule-ad-2" />
                </div>
              </div>
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
              <div className="progress-fill" style={{ width: `${((currentIdx + 1) / sessionItems.length) * 100}%` }} />
            </div>

            {/* Question Card */}
            <div className="card-glow" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {currentItem.sentence.split('___').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span style={{
                        display: 'inline-block', borderBottom: '2px solid var(--goti-amber)',
                        minWidth: '90px', padding: '0 8px', textAlign: 'center',
                        fontWeight: 700, color: 'var(--goti-amber)', margin: '0 4px',
                      }}>
                        {currentInput || '___'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Input & Submit */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && currentInput.trim()) handleNext(); }}
                  placeholder="Type missing word..."
                  className="typing-input"
                  style={{ flex: 1, minWidth: '200px' }}
                  autoFocus
                />
                <button
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!currentInput.trim()}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {currentIdx + 1 === sessionItems.length ? 'Finish' : 'Next'} <ArrowRight size={16} />
                  </span>
                </button>
              </div>

              {/* Explanation note */}
              {currentItem.hint && (
                <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} /> Hint: {currentItem.hint}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {sessionState === 'result' && (
          <div>
            <div className="card-glow" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--goti-amber)', marginBottom: '8px' }}>
                {score} / {sessionItems.length}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Session Complete!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {score >= 8 ? '🎉 Outstanding vocabulary and grammar control!' : score >= 5 ? '👍 Good attempt! Review items below to improve.' : '💪 Keep practicing! Regular cloze tests build accuracy.'}
              </p>

              {/* Review List */}
              <div style={{ textAlign: 'left', marginTop: '2rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Review Answers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sessionItems.map((item, idx) => {
                    const userAns = userAnswers[idx] || '';
                    const isCorrect = userAns.toLowerCase() === item.correctWord.toLowerCase();
                    return (
                      <div key={item.id} style={{
                        padding: '1rem', borderRadius: '10px',
                        background: isCorrect ? 'rgba(52,211,153,0.05)' : 'rgba(244,63,94,0.05)',
                        border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.2)' : 'rgba(244,63,94,0.2)'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                          {isCorrect ? <CheckCircle2 size={18} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} /> : <XCircle size={18} style={{ color: '#f43f5e', flexShrink: 0, marginTop: '2px' }} />}
                          <div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '4px' }}>{item.sentence.replace('___', `[${item.blank}]`)}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Your answer: <span style={{ color: isCorrect ? '#34d399' : '#f43f5e', fontWeight: 600 }}>{userAns || '(blank)'}</span>
                              {!isCorrect && <span> | Correct: <span style={{ color: '#34d399', fontWeight: 600 }}>{item.blank}</span></span>}
                            </div>
                            {item.explanation && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                💡 {item.explanation}
                              </div>
                            )}
                          </div>
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

        {/* Bottom Banner Ad before Footer */}
        <AdSlot type="banner" slotId="sentences-bottom-banner-ad" style={{ marginTop: '2.5rem' }} />
        </div>
        <AdSlot type="vertical-right" />
      </div>
    </div>
  );
};

export default SentenceCompletion;
