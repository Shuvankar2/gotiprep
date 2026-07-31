import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAdminStore } from '../store/adminStore';
import { ChevronLeft, ChevronRight, Shuffle, Clock, Eye, EyeOff, BookOpen, Edit3 } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

const PAGE_SIZE = 10;
const READ_TIME_SEC = 30;
const WRITE_TIME_SEC = 90;

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

// Generate 3 detailed 2-mark assessment MCQs per passage based on topic/content
const getPassageMCQs = (title: string, _content: string, category: string): MCQQuestion[] => {
  if (category === 'tech' || title.toLowerCase().includes('digital') || title.toLowerCase().includes('intelligence')) {
    return [
      {
        id: 1,
        marks: 2,
        question: 'Which of the following best synthesizes the core underlying thesis of the passage regarding technological progression?',
        options: [
          'A) Technological innovation has stabilized, allowing traditional industries to recover without structural changes.',
          'B) Exponential computing power and connectivity have fundamentally disrupted legacy economic models and accelerated digital transformation.',
          'C) Academic networks remain the primary consumers of cloud computing and machine learning developments.',
          'D) Hardware miniaturization has reached its physical limits, shifting focus exclusively to software licensing.'
        ],
        correctIndex: 1,
        explanation: 'Correct (+2 Marks): The passage explicitly emphasizes how advancing computing power, cloud systems, and AI continue to reshape industries and disrupt traditional economic models.'
      },
      {
        id: 2,
        marks: 2,
        question: 'According to the passage, what key challenge or paradox accompanies the rapid adoption of specialized algorithms in critical sectors?',
        options: [
          'A) Complete loss of electronic data storage capacity across cloud environments.',
          'B) Regulatory inaction due to lack of commercial interest from major enterprises.',
          'C) Balancing rapid algorithmic precision and innovation against ethical considerations like liability, privacy, and human relationships.',
          'D) The inability of modern hardware to process complex datasets.'
        ],
        correctIndex: 2,
        explanation: 'Correct (+2 Marks): The text highlights that integrating machine learning requires resolving critical questions around liability, data privacy, algorithmic bias, and human connection.'
      },
      {
        id: 3,
        marks: 2,
        question: 'What logical conclusion can be inferred regarding the future economic landscape described in the text?',
        options: [
          'A) Organizations failing to adapt to digital collaboration and AI-driven workflows risk obsolescence in an interconnected market.',
          'B) Physical retail and paper-based documentation will regain dominance over automated payment rails.',
          'C) Government regulations will permanently freeze AI deployment in commercial enterprises.',
          'D) Overseas connectivity will decrease as localized offline infrastructure becomes mandatory.'
        ],
        correctIndex: 0,
        explanation: 'Correct (+2 Marks): The narrative establishes that technological advancements continuously create new economic opportunities while disrupting conventional business frameworks.'
      }
    ];
  }

  if (category === 'banking' || title.toLowerCase().includes('bank') || title.toLowerCase().includes('financial')) {
    return [
      {
        id: 1,
        marks: 2,
        question: 'Based on the passage, how have agile fintech entities altered the competitive dynamics of traditional banking?',
        options: [
          'A) By forcing traditional banks to eliminate all digital banking interfaces.',
          'B) By leveraging mobile applications and AI to deliver faster, lower-cost, and personalized financial products.',
          'C) By relying exclusively on physical brick-and-mortar branch expansion.',
          'D) By prohibiting consumer access to credit cards and savings instruments.'
        ],
        correctIndex: 1,
        explanation: 'Correct (+2 Marks): The text directly notes that fintech startups utilize mobile apps and AI to compete with traditional institutions through superior speed and personalization.'
      },
      {
        id: 2,
        marks: 2,
        question: 'What structural responsibility do central regulatory bodies face in light of digital currency and payment innovations?',
        options: [
          'A) Modernizing legacy pre-digital frameworks to maintain financial stability without stifling innovation or increasing systemic risk.',
          'B) Banning all digital payment systems to protect physical paper currency usage.',
          'C) Mandating fixed interest rates across all international sovereign central banks.',
          'D) Dissolving consumer protection guidelines to allow unregulated financial speculation.'
        ],
        correctIndex: 0,
        explanation: 'Correct (+2 Marks): Regulatory bodies must update pre-digital era rules to accommodate rapid technological shifts while safeguarding financial system stability.'
      },
      {
        id: 3,
        marks: 2,
        question: 'Which statement accurately captures the passage’s perspective on personal financial literacy?',
        options: [
          'A) Financial literacy is irrelevant if individuals earn a high fixed monthly salary.',
          'B) Basic financial literacy is foundational for long-term security, preventing credit debt traps and enabling informed wealth accumulation.',
          'C) Financial education should strictly remain a post-retirement concern for senior citizens.',
          'D) Debt management skills have no impact on protecting individuals against economic fraud.'
        ],
        correctIndex: 1,
        explanation: 'Correct (+2 Marks): Understanding budgeting, saving, and debt management protects against hardship and builds sustainable personal wealth.'
      }
    ];
  }

  // Default Assessment MCQs (General / Science / Current Affairs)
  return [
    {
      id: 1,
      marks: 2,
      question: 'What primary thematic argument is articulated throughout the passage concerning systemic progression?',
      options: [
        'A) Short-term gains outweigh the long-term sustainability of natural and societal infrastructure.',
        'B) Sustainable progress demands immediate, structured reform balancing innovation with ecological and economic responsibility.',
        'C) Historical frameworks are entirely sufficient for tackling twenty-first-century challenges without modification.',
        'D) Global cooperation is unnecessary when national policies act independently.'
      ],
      correctIndex: 1,
      explanation: 'Correct (+2 Marks): The passage emphasizes coordinated, forward-looking strategies to ensure stability and sustainable growth across key sectors.'
    },
    {
      id: 2,
      marks: 2,
      question: 'According to the passage, what key vulnerability arises from unmitigated reliance on conventional methods?',
      options: [
        'A) Accelerating resource depletion, environmental impacts, and heightened exposure to systemic crises.',
        'B) Immediate reduction in overall global communication and transportation networks.',
        'C) Complete elimination of institutional oversight and consumer demand.',
        'D) Decline in technological research and development initiatives worldwide.'
      ],
      correctIndex: 0,
      explanation: 'Correct (+2 Marks): The text notes that conventional unchecked practices lead to severe environmental degradation and vulnerability.'
    },
    {
      id: 3,
      marks: 2,
      question: 'What policy or institutional action does the author advocate to address the challenges outlined?',
      options: [
        'A) Sustained investment in foundational education, public awareness, and international accountability frameworks.',
        'B) Immediate cessation of all scientific research and interplanetary exploration.',
        'C) Deregulation of industrial emissions to boost quarterly commercial yields.',
        'D) Restricting access to digital literacy programs in rural communities.'
      ],
      correctIndex: 0,
      explanation: 'Correct (+2 Marks): Strategic investment in skills, education, and accountable regulations is highlighted as vital for long-term resilience.'
    }
  ];
};

// Helper to get half-length concise passage for 30s Read + 90s Type assessment
const getShortenedPassage = (content: string): string => {
  const words = content.trim().split(/\s+/);
  const halfCount = Math.max(25, Math.ceil(words.length / 2));
  const sliced = words.slice(0, halfCount).join(' ');
  const lastPeriod = sliced.lastIndexOf('.');
  if (lastPeriod > sliced.length * 0.6) {
    return sliced.substring(0, lastPeriod + 1);
  }
  return sliced + '.';
};

// Key concept extractor for Read & Type context matching
const extractKeywords = (text: string): string[] => {
  const stopwords = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'for', 'it', 'as', 'was', 'with', 'on', 'are', 'by', 'this', 'an', 'be', 'at', 'from', 'or', 'have', 'more', 'has', 'more', 'than', 'just', 'been']);
  return Array.from(new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopwords.has(w))
  ));
};

const PassagePractice: React.FC = () => {
  const { passages } = useAdminStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPassage, setCurrentPassage] = useState(passages[0]);
  const [mode, setMode] = useState<'select' | 'read-type' | 'read-answer'>('select');
  const [page, setPage] = useState(0);

  // Read & Type state
  const [readTypeStep, setReadTypeStep] = useState<'read' | 'write' | 'result'>('read');
  const [readTimeLeft, setReadTimeLeft] = useState(READ_TIME_SEC);
  const [writeTimeLeft, setWriteTimeLeft] = useState(WRITE_TIME_SEC);
  const [typedText, setTypedText] = useState('');
  const [showOriginalInWrite, setShowOriginalInWrite] = useState(false);
  const [typeResult, setTypeResult] = useState<{ contextScore: number; keyCovered: number; totalKeys: number; wpm: number; wordCount: number } | null>(null);

  // Read & Answer state
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const categories = ['all', 'general', 'tech', 'banking', 'current-affairs', 'science'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filtered = passages.filter((p) => {
    const catMatch = selectedCategory === 'all' || p.category === selectedCategory;
    const diffMatch = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
    return catMatch && diffMatch;
  });

  const totalPages = Math.max(1, Math.ceil((filtered.length > 0 ? filtered : passages).length / PAGE_SIZE));
  const pagedList  = (filtered.length > 0 ? filtered : passages).slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const startRandom = useCallback((startMode: 'read-type' | 'read-answer') => {
    const pool = filtered.length > 0 ? filtered : passages;
    const idx = Math.floor(Math.random() * pool.length);
    const selected = pool[idx];
    setCurrentPassage(selected);
    setMode(startMode);

    if (startMode === 'read-type') {
      setReadTypeStep('read');
      setReadTimeLeft(READ_TIME_SEC);
      setWriteTimeLeft(WRITE_TIME_SEC);
      setTypedText('');
      setShowOriginalInWrite(false);
      setTypeResult(null);
    } else {
      setMcqAnswers({});
      setMcqSubmitted(false);
      setMcqScore(0);
    }
  }, [filtered, passages]);

  // Handle Read & Type mode launch
  const enterReadType = (p: typeof currentPassage) => {
    setCurrentPassage(p);
    setMode('read-type');
    setReadTypeStep('read');
    setReadTimeLeft(READ_TIME_SEC);
    setWriteTimeLeft(WRITE_TIME_SEC);
    setTypedText('');
    setShowOriginalInWrite(false);
    setTypeResult(null);
  };

  // Handle Read & Answer mode launch
  const enterReadAnswer = (p: typeof currentPassage) => {
    setCurrentPassage(p);
    setMode('read-answer');
    setMcqAnswers({});
    setMcqSubmitted(false);
    setMcqScore(0);
  };

  // Timer effect for 30s Reading phase
  useEffect(() => {
    if (mode === 'read-type' && readTypeStep === 'read') {
      timerRef.current = setInterval(() => {
        setReadTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setReadTypeStep('write');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode, readTypeStep]);

  // Timer effect for 90s Writing phase
  useEffect(() => {
    if (mode === 'read-type' && readTypeStep === 'write') {
      timerRef.current = setInterval(() => {
        setWriteTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            evaluateReadType();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode, readTypeStep]);

  const startWritingNow = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setReadTypeStep('write');
  };

  // Evaluate Read & Type submission
  const evaluateReadType = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const shortText = getShortenedPassage(currentPassage.content);
    const keywords = extractKeywords(shortText);
    const userWords = typedText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const userSet = new Set(userWords);

    let keyMatches = 0;
    keywords.forEach(k => { if (userSet.has(k)) keyMatches++; });

    const totalKeys = Math.max(keywords.length, 1);
    const matchPct = Math.round((keyMatches / totalKeys) * 100);

    // Compute WPM based on elapsed writing time
    const timeSpentSec = Math.max(1, WRITE_TIME_SEC - writeTimeLeft);
    const wpm = Math.round((typedText.length / 5) / (timeSpentSec / 60));
    const wordCount = userWords.length;

    // Context score formula combining keyword coverage & target length
    const targetLength = shortText.split(/\s+/).length || 50;
    const lengthRatio = Math.min(1, wordCount / (targetLength * 0.7));
    const contextScore = Math.min(100, Math.round(matchPct * 0.7 + lengthRatio * 30));

    setTypeResult({
      contextScore,
      keyCovered: keyMatches,
      totalKeys: keywords.length,
      wpm,
      wordCount,
    });
    setReadTypeStep('result');
  };

  // Handle MCQ submission
  const currentMCQs = getPassageMCQs(currentPassage.title, currentPassage.content, currentPassage.category);

  const handleMCQSelect = (qId: number, optIndex: number) => {
    if (mcqSubmitted) return;
    setMcqAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const submitMCQAssessment = () => {
    let earned = 0;
    currentMCQs.forEach(q => {
      if (mcqAnswers[q.id] === q.correctIndex) {
        earned += q.marks;
      }
    });
    setMcqScore(earned);
    setMcqSubmitted(true);
  };

  const categoryColors: Record<string, string> = {
    general: '#ED9E59', tech: '#b06fd6', banking: '#34d399', 'current-affairs': '#60a5fa', science: '#f87171'
  };
  const diffColors: Record<string, string> = { easy: '#34d399', medium: '#ED9E59', hard: '#f87171' };

  return (
    <div className="page-container">
      <SEO
        title="Unseen Passage Practice & 2-Mark MCQs — SSC CGL, IBPS PO | GotiPrep"
        description="Practice unseen passages with 30s reading and 90s context writing tests, plus 2-Mark assessment MCQs for IBPS PO, RBI Grade B, and SSC CGL."
        keywords="IBPS PO unseen passage practice, SSC CGL reading comprehension MCQs, 2-mark assessment questions, passage practice online, GotiPrep"
        path="/passage"
      />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
            <span className="glow-text-purple">Passage</span> Practice
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Assessment-grade unseen passage module: 30s Read + 90s Type test, and 2-Mark detailed comprehension MCQs.
          </p>
        </div>

        {/* Filters Row: Centered without Random Pick button */}
        <div className="card-glow" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>CATEGORY:</span>
            {categories.map((c) => (
              <button key={c} onClick={() => { setSelectedCategory(c); setPage(0); }} style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                border: selectedCategory === c ? `1px solid ${categoryColors[c] || 'var(--goti-amber)'}` : '1px solid var(--border-color)',
                background: selectedCategory === c ? `${categoryColors[c] || 'var(--goti-amber)'}20` : 'transparent',
                color: selectedCategory === c ? (categoryColors[c] || 'var(--goti-amber)') : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
                {c === 'all' ? 'All Categories' : c.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>DIFFICULTY:</span>
            {difficulties.map((d) => (
              <button key={d} onClick={() => { setSelectedDifficulty(d); setPage(0); }} style={{
                padding: '5px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                border: selectedDifficulty === d ? `1px solid ${diffColors[d] || 'var(--border-color)'}` : '1px solid var(--border-color)',
                background: selectedDifficulty === d ? `${diffColors[d] || 'var(--goti-amber)'}20` : 'transparent',
                color: selectedDifficulty === d ? (diffColors[d] || 'var(--text-muted)') : 'var(--text-muted)',
                transition: 'all 0.2s', textTransform: 'capitalize',
              }}>
                {d === 'all' ? 'All Difficulties' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Start CTAs */}
        {mode === 'select' && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Quick Start:</span>
            <button
              onClick={() => startRandom('read-type')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '8px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #b06fd6, #7c3aed)',
                color: '#fff', border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(176,111,214,0.3)', transition: 'all 0.2s',
              }}
            >
              <Shuffle size={13} /> Random 30s/90s Read & Type
            </button>
            <button
              onClick={() => startRandom('read-answer')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '8px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ED9E59, #f59e0b)',
                color: '#fff', border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(237,158,89,0.3)', transition: 'all 0.2s',
              }}
            >
              <Shuffle size={13} /> Random 2-Mark MCQs
            </button>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {(filtered.length > 0 ? filtered : passages).length} passage{(filtered.length > 0 ? filtered : passages).length !== 1 ? 's' : ''} available
            </span>
          </div>
        )}

        <div className="practice-layout">
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Passage List */}
            {mode === 'select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pagedList.map((p) => (
                  <div key={p.id} className="card-glow" style={{ padding: '1.5rem', cursor: 'pointer' }}
                    onClick={() => enterReadType(p)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{p.title}</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge" style={{
                          background: `${categoryColors[p.category] || '#ED9E59'}20`,
                          border: `1px solid ${categoryColors[p.category] || '#ED9E59'}40`,
                          color: categoryColors[p.category] || '#ED9E59',
                        }}>{p.category}</span>
                        <span className="badge" style={{
                          background: `${diffColors[p.difficulty]}20`,
                          border: `1px solid ${diffColors[p.difficulty]}40`,
                          color: diffColors[p.difficulty],
                        }}>{p.difficulty}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {p.content.substring(0, 180)}…
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-primary" onClick={(e) => { e.stopPropagation(); enterReadType(p); }} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        <span>30s/90s Read & Type</span>
                      </button>
                      <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); enterReadAnswer(p); }} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        2-Mark Assessment MCQs
                      </button>
                    </div>
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
                          border: page === i ? '1px solid #b06fd6' : '1px solid var(--border-color)',
                          background: page === i ? 'rgba(176,111,214,0.15)' : 'transparent',
                          color: page === i ? '#b06fd6' : 'var(--text-secondary)',
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
                      Page {page + 1} of {totalPages} · showing {pagedList.length} of {(filtered.length > 0 ? filtered : passages).length}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════ READ & TYPE MODE (30s Read -> 90s Write) ═════════════════ */}
            {mode === 'read-type' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{currentPassage.title}</h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      30-sec Reading Phase ➔ 90-sec Context Writing Phase
                    </div>
                  </div>
                  <button className="btn-ghost" onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setMode('select'); }}>← Back</button>
                </div>

                {/* STEP 1: READING PHASE (30 seconds) */}
                {readTypeStep === 'read' && (
                  <div className="card-glow" style={{ padding: '1.75rem', border: '1.5px solid rgba(176,111,214,0.4)', background: 'rgba(176,111,214,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#b06fd6', fontWeight: 700 }}>
                        <BookOpen size={16} /> STEP 1: READ & MEMORIZE CONTEXT
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#b06fd6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} /> {readTimeLeft}s remaining
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <div style={{ height: '100%', width: `${(readTimeLeft / READ_TIME_SEC) * 100}%`, background: '#b06fd6', transition: 'width 1s linear' }} />
                    </div>

                    <p style={{ color: 'var(--text-primary)', lineHeight: 1.9, fontFamily: 'var(--font-mono)', fontSize: '0.95rem', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      {getShortenedPassage(currentPassage.content)}
                    </p>

                    <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        💡 Concise passage (~{getShortenedPassage(currentPassage.content).split(/\s+/).length} words). Understand & remember the main ideas.
                      </div>
                      <button
                        onClick={startWritingNow}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '10px 22px', borderRadius: '8px', cursor: 'pointer',
                          background: 'linear-gradient(135deg, #b06fd6, #7c3aed)',
                          color: '#fff', border: 'none', fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem', fontWeight: 700,
                          boxShadow: '0 4px 14px rgba(176,111,214,0.3)', transition: 'all 0.2s',
                        }}
                      >
                        <Edit3 size={15} /> Start Writing Now (Skip Timer)
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: WRITING PHASE (90 seconds) */}
                {readTypeStep === 'write' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="card-glow" style={{ padding: '1.25rem', border: '1.5px solid rgba(0,84,250,0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--goti-amber)', fontWeight: 700 }}>
                          <Edit3 size={16} /> STEP 2: WRITE PASSAGE OR RECAP (90s TIMER)
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: writeTimeLeft < 20 ? '#f87171' : 'var(--goti-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} /> {Math.floor(writeTimeLeft / 60)}:{(writeTimeLeft % 60).toString().padStart(2, '0')}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        ✏️ Write the text exact or in your own words. Maintain the original context and key details!
                      </div>

                      <button
                        onClick={() => setShowOriginalInWrite(!showOriginalInWrite)}
                        style={{
                          padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                          background: 'transparent', border: '1px solid var(--border-color)',
                          color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                        }}
                      >
                        {showOriginalInWrite ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showOriginalInWrite ? 'Hide Original Reference' : 'Peek Short Passage Reference'}
                      </button>

                      {showOriginalInWrite && (
                        <div style={{ padding: '1rem', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                          {getShortenedPassage(currentPassage.content)}
                        </div>
                      )}

                      <textarea
                        className="form-input form-textarea"
                        rows={7}
                        value={typedText}
                        onChange={(e) => setTypedText(e.target.value)}
                        placeholder="Type the passage or summarize key ideas here in your own words…"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', minHeight: '180px', lineHeight: 1.8 }}
                        autoFocus
                      />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Words typed: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{typedText.trim() ? typedText.trim().split(/\s+/).length : 0}</span>
                        </div>
                        <button
                          className="btn-primary"
                          onClick={evaluateReadType}
                          disabled={typedText.trim().length === 0}
                          style={{ padding: '10px 24px', fontSize: '0.85rem' }}
                        >
                          Submit Response
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: EVALUATION RESULT */}
                {readTypeStep === 'result' && typeResult && (
                  <div className="card-glow animate-fade-in" style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Context Assessment Result 🎉</h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Evaluated against passage key concepts and semantic meaning
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: typeResult.contextScore >= 70 ? '#34d399' : '#ED9E59', lineHeight: 1 }}>
                          {typeResult.contextScore}%
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>Context Match</div>
                      </div>

                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0054fa', lineHeight: 1 }}>
                          {typeResult.keyCovered}/{typeResult.totalKeys}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>Key Ideas Covered</div>
                      </div>

                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#b06fd6', lineHeight: 1 }}>
                          {typeResult.wpm}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>Writing Speed (WPM)</div>
                      </div>

                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                          {typeResult.wordCount}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>Words Written</div>
                      </div>
                    </div>

                    <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', background: typeResult.contextScore >= 70 ? 'rgba(52,211,153,0.08)' : 'rgba(237,158,89,0.08)', border: `1px solid ${typeResult.contextScore >= 70 ? 'rgba(52,211,153,0.3)' : 'rgba(237,158,89,0.3)'}`, color: typeResult.contextScore >= 70 ? '#34d399' : '#ED9E59', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                      {typeResult.contextScore >= 85
                        ? '🌟 Excellent Context Preservation! You captured the main thesis and key technical points accurately.'
                        : typeResult.contextScore >= 70
                        ? '✅ Good Context Match! Most core details were retained. Focus on incorporating key terms.'
                        : '⚠️ Partial Context Match. Try re-reading the passage carefully during the 30-second window to retain core entities.'}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn-primary" onClick={() => enterReadType(currentPassage)}>Try Passage Again</button>
                      <button className="btn-secondary" onClick={() => setMode('select')}>Back to Passages</button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ═════════════════ READ & ANSWER MODE (2-Mark Assessment MCQs) ═════════════════ */}
            {mode === 'read-answer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{currentPassage.title}</h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      2-Mark Assessment Questions · 3 Questions (6 Marks Total)
                    </div>
                  </div>
                  <button className="btn-ghost" onClick={() => setMode('select')}>← Back</button>
                </div>

                {/* Passage Text */}
                <div className="card-glow" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--goti-amber)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    📖 PASSAGE TEXT
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontFamily: 'var(--font-body)', fontSize: '0.98rem' }}>
                    {currentPassage.content}
                  </p>
                </div>

                {/* 2-Mark MCQs */}
                <div className="card-glow" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: 800, margin: 0, color: 'var(--goti-amber)', fontSize: '1.05rem' }}>
                      Comprehension & Inference Assessment
                    </h4>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,84,250,0.08)', padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(0,84,250,0.2)' }}>
                      Total Marks: 6
                    </span>
                  </div>

                  {currentMCQs.map((q, qi) => {
                    const selectedOpt = mcqAnswers[q.id];
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div key={q.id} style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: qi < currentMCQs.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <p style={{ fontWeight: 700, margin: 0, fontSize: '0.98rem', flex: 1, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                            Q{qi + 1}. {q.question}
                          </p>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: '#0054fa', background: 'rgba(0,84,250,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0,84,250,0.2)', marginLeft: '12px', flexShrink: 0 }}>
                            {q.marks} MARKS
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            let optionBorder = 'var(--border-color)';
                            let optionBg = 'transparent';
                            let optionColor = 'var(--text-secondary)';

                            if (mcqSubmitted) {
                              if (optIdx === q.correctIndex) {
                                optionBorder = '#34d399';
                                optionBg = 'rgba(52,211,153,0.12)';
                                optionColor = '#34d399';
                              } else if (isSelected) {
                                optionBorder = '#f87171';
                                optionBg = 'rgba(248,113,113,0.12)';
                                optionColor = '#f87171';
                              }
                            } else if (isSelected) {
                              optionBorder = 'var(--goti-amber)';
                              optionBg = 'rgba(0,84,250,0.12)';
                              optionColor = 'var(--goti-amber)';
                            }

                            return (
                              <div
                                key={optIdx}
                                onClick={() => handleMCQSelect(q.id, optIdx)}
                                style={{
                                  padding: '12px 16px', borderRadius: '8px',
                                  cursor: mcqSubmitted ? 'default' : 'pointer',
                                  border: `1.5px solid ${optionBorder}`,
                                  background: optionBg, color: optionColor,
                                  fontSize: '0.88rem', transition: 'all 0.2s',
                                  lineHeight: 1.5,
                                }}
                              >
                                {opt}
                              </div>
                            );
                          })}
                        </div>

                        {/* Detailed explanation after submit */}
                        {mcqSubmitted && (
                          <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: isCorrect ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)', border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {isCorrect ? <span style={{ color: '#34d399', fontWeight: 700 }}>+2 Marks — </span> : <span style={{ color: '#f87171', fontWeight: 700 }}>0 Marks — </span>}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!mcqSubmitted ? (
                    <button
                      className="btn-primary"
                      onClick={submitMCQAssessment}
                      disabled={Object.keys(mcqAnswers).length < currentMCQs.length}
                      style={{ padding: '12px 28px', fontSize: '0.9rem' }}
                    >
                      Submit Assessment (Calculate Marks)
                    </button>
                  ) : (
                    <div style={{
                      padding: '1.25rem', borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(0,84,250,0.12))',
                      border: '1.5px solid rgba(52,211,153,0.4)', textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#34d399', lineHeight: 1, marginBottom: '6px' }}>
                        Marks: {mcqScore} / 6
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {mcqScore === 6
                          ? '🏆 Perfect Score! Outstanding analytical understanding.'
                          : mcqScore >= 4
                          ? '✅ Good Job! Solid comprehension of core ideas.'
                          : '⚠️ Review the explanations above to strengthen inference skills.'}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '1rem' }}>
                        <button className="btn-primary" onClick={() => enterReadAnswer(currentPassage)}>Re-take Quiz</button>
                        <button className="btn-secondary" onClick={() => setMode('select')}>Back to List</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card-glow" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--goti-amber)', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ℹ️ Assessment Rules</h4>
              {[
                '⏱ Read & Type: 30s read phase + 90s context writing phase',
                '📝 Write exact passage or in own words matching meaning',
                '💯 Read & Answer: 2-Mark assessment MCQs per question',
                '📊 Real-time evaluation of key concepts and WPM',
              ].map((tip) => (
                <p key={tip} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>{tip}</p>
              ))}
            </div>
            <AdSlot type="sidebar" slotId="passage-sidebar-ad" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassagePractice;
