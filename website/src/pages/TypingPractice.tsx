import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAdminStore } from '../store/adminStore';
import { RotateCcw, Play, Copy, Check, Download, Share2, User } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';

// ─── Types ─────────────────────────────────────────────────────────────────────
type TestMode  = 'practice' | 'exam' | 'certification';
type TestPhase = 'setup' | 'running' | 'results';
type CharState = 'idle' | 'correct' | 'incorrect';
type DiffFilter = 'all' | 'easy' | 'medium' | 'hard';

interface WpmPoint { time: number; wpm: number; }

interface ResultData {
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  errors: number;
  totalTyped: number;
  elapsedSeconds: number;
  mode: TestMode;
  wpmHistory: WpmPoint[];
  tabSwitches: number;
  passageTitle: string;
  difficulty: string;
  charStates: CharState[];
  passageContent: string;
  timestamp: string;
}

interface PersonalBest { netWpm: number; accuracy: number; date: string; }

// ─── Mode Configuration ────────────────────────────────────────────────────────
const MODE_CONFIG: Record<TestMode, {
  label: string; icon: string; accent: string; accentBg: string; accentBorder: string;
  desc: string; countsTowardPB: boolean;
}> = {
  practice: {
    label: 'Practice Mode',   icon: '🎯',
    accent: '#0054fa',        accentBg: 'rgba(0,84,250,0.08)',    accentBorder: 'rgba(0,84,250,0.25)',
    desc: 'Free practice with live error feedback. Backspace enabled. Results are for training only.',
    countsTowardPB: false,
  },
  exam: {
    label: 'Exam Simulation', icon: '⚡',
    accent: '#ED9E59',        accentBg: 'rgba(237,158,89,0.08)', accentBorder: 'rgba(237,158,89,0.25)',
    desc: 'Replicates TCS NQT, SSC, and Banking exam conditions. Backspace disabled. Ranked.',
    countsTowardPB: true,
  },
  certification: {
    label: 'Challenge Mode',  icon: '🏆',
    accent: '#b06fd6',        accentBg: 'rgba(176,111,214,0.08)', accentBorder: 'rgba(176,111,214,0.25)',
    desc: 'Strictest exam replica. Generates a shareable Instagram achievement post. Ranked.',
    countsTowardPB: true,
  },
};

const DIFF_COLORS: Record<DiffFilter, string> = {
  all: '#0054fa', easy: '#34d399', medium: '#ED9E59', hard: '#f87171',
};

const getPBKey = (mode: TestMode, dur: number) => `gotiprep_pb_${mode}_${dur}`;

// ─── Sparkline Graph ───────────────────────────────────────────────────────────
function SparklineGraph({ data, accent }: { data: WpmPoint[]; accent: string }) {
  if (data.length < 2) {
    return (
      <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
        Not enough data
      </div>
    );
  }
  const W = 360, H = 72, P = 6;
  const maxW = Math.max(...data.map(d => d.wpm), 1);
  const maxT = Math.max(...data.map(d => d.time), 1);
  const pts = data.map(d => ({
    x: P + (d.time / maxT) * (W - 2 * P),
    y: H - P - (d.wpm / maxW) * (H - 2 * P),
  }));
  const poly = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `M ${pts[0].x.toFixed(1)},${H} ` + pts.map(p => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ` L ${pts[pts.length - 1].x.toFixed(1)},${H} Z`;
  const gradId = `sg${accent.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 72 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <polyline points={poly} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={accent} stroke="var(--bg-primary)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─── Achievement Card DOM element (rendered for display) ───────────────────────
function AchievementCard({ result, userName }: { result: ResultData; userName: string }) {
  const acc = result.accuracy;
  const grade = acc >= 98 ? 'S+' : acc >= 95 ? 'S' : acc >= 90 ? 'A' : acc >= 80 ? 'B' : 'C';

  // Vibrant grade-specific gradient palettes
  const gradients: Record<string, { from: string; mid: string; to: string; glow: string }> = {
    'S+': { from: '#ff6b35', mid: '#f7931e', to: '#ffcd3c', glow: '#ffcd3c' },
    'S':  { from: '#a855f7', mid: '#ec4899', to: '#f43f5e', glow: '#a855f7' },
    'A':  { from: '#10b981', mid: '#06b6d4', to: '#3b82f6', glow: '#10b981' },
    'B':  { from: '#f59e0b', mid: '#f97316', to: '#ef4444', glow: '#f59e0b' },
    'C':  { from: '#6b7280', mid: '#9ca3af', to: '#d1d5db', glow: '#9ca3af' },
  };
  const pal = gradients[grade];

  const statPalette = [
    { label: 'NET WPM',   value: String(result.netWpm),         from: '#3b82f6', to: '#06b6d4' },
    { label: 'GROSS WPM', value: String(result.grossWpm),       from: '#10b981', to: '#34d399' },
    { label: 'ACCURACY',  value: `${result.accuracy}%`,         from: '#f59e0b', to: '#fcd34d' },
    { label: 'ERRORS',    value: String(result.errors),          from: '#ef4444', to: '#f87171' },
  ];

  const displayName = userName.trim() || 'Champion';

  return (
    <div id="achievement-card-dom" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 35%, #24243e 65%, #0f0c29 100%)',
      borderRadius: '20px', padding: '1.6rem 1.5rem',
      border: `1.5px solid ${pal.glow}44`,
      position: 'relative', overflow: 'hidden',
      aspectRatio: '1 / 1', maxWidth: '380px', margin: '0 auto',
      boxShadow: `0 0 80px ${pal.glow}25, 0 20px 60px rgba(0,0,0,0.6)`,
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Animated mesh orbs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${pal.from}30, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${pal.to}25, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${pal.mid}12, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Top row: GOTIPREP badge + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(90deg, ${pal.from}, ${pal.to})`,
          borderRadius: '6px', padding: '3px 10px',
          fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#fff',
          textShadow: `0 0 10px ${pal.glow}`,
        }}>GOTIPREP</div>
        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{result.timestamp}</div>
      </div>

      {/* Name */}
      {displayName && (
        <div style={{ textAlign: 'center', marginBottom: '0.3rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            🎉 {displayName}
          </div>
        </div>
      )}

      {/* Grade */}
      <div style={{ textAlign: 'center', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '5.5rem', fontWeight: 900, lineHeight: 1,
          background: `linear-gradient(135deg, ${pal.from}, ${pal.mid}, ${pal.to})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: `drop-shadow(0 0 20px ${pal.glow}88)`,
        }}>{grade}</div>
        <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
          PERFORMANCE GRADE
        </div>
      </div>

      {/* Stats grid 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
        {statPalette.map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '9px 10px',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              fontSize: '1.55rem', fontWeight: 800, lineHeight: 1,
              background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{s.value}</div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info bar */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '9px', padding: '6px 10px', marginBottom: '0.7rem', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.passageTitle}</div>
        <div style={{ fontSize: '0.53rem', color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
          {MODE_CONFIG[result.mode].label} · {result.difficulty} · {Math.ceil(result.elapsedSeconds / 60)} min
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)' }}>gotiprep.shuvankar.qzz.io</div>
        <div style={{
          fontSize: '0.55rem', fontWeight: 700,
          background: `linear-gradient(90deg, ${pal.from}, ${pal.to})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {result.mode === 'certification' ? '#GotiPrepChallenge' : result.mode === 'exam' ? '#GotiPrepExam' : '#GotiPrep'}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const TypingPractice: React.FC = () => {
  const { typingPassages } = useAdminStore();

  // Setup state
  const [mode,         setMode]         = useState<TestMode>('practice');
  const [duration,     setDuration]     = useState(5);
  const [difficulty,   setDifficulty]   = useState<DiffFilter>('all');
  const [category,     setCategory]     = useState('all');
  const [backspaceLock, setBackspaceLock] = useState(false);
  const [wordHighlight, setWordHighlight] = useState(true);
  const [blindMode,    setBlindMode]    = useState(false);

  // Test state
  const [phase,        setPhase]        = useState<TestPhase>('setup');
  const [typedText,    setTypedText]    = useState('');
  const [charStates,   setCharStates]   = useState<CharState[]>([]);
  const [errors,       setErrors]       = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(duration * 60);
  const [wpmHistory,   setWpmHistory]   = useState<WpmPoint[]>([]);
  const [tabSwitches,  setTabSwitches]  = useState(0);
  const [result,       setResult]       = useState<ResultData | null>(null);
  const [copied,       setCopied]       = useState(false);
  const [isFocused,    setIsFocused]    = useState(false);
  const [userName,     setUserName]     = useState('');
  const [downloading,  setDownloading]  = useState(false);

  // Refs
  const inputRef       = useRef<HTMLInputElement>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmSampleRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef   = useRef<number>(0);
  const isFinishedRef  = useRef(false);
  const tabSwitchRef   = useRef(0);
  const phaseRef       = useRef<TestPhase>('setup');
  const charStatesRef  = useRef<CharState[]>([]);
  const typedTextRef   = useRef('');
  const errorsRef      = useRef(0);
  const wpmHistoryRef  = useRef<WpmPoint[]>([]);
  const modeRef        = useRef<TestMode>('practice');
  const durationRef    = useRef(5);
  const selectedRef    = useRef(typingPassages[0]);
  const passageRef     = useRef('');

  phaseRef.current      = phase;
  charStatesRef.current = charStates;
  typedTextRef.current  = typedText;
  errorsRef.current     = errors;
  wpmHistoryRef.current = wpmHistory;
  modeRef.current       = mode;
  durationRef.current   = duration;

  // Filtered passages
  const allCategories = ['all', ...Array.from(new Set(typingPassages.map(p => p.category)))];
  const filteredPassages = (() => {
    const f = typingPassages.filter(p => {
      const okDiff = difficulty === 'all' || p.difficulty === difficulty;
      const okCat  = category  === 'all' || p.category  === category;
      return okDiff && okCat;
    });
    return f.length > 0 ? f : typingPassages;
  })();

  const [selectedPassage, setSelectedPassage] = useState(filteredPassages[0] || typingPassages[0]);

  useEffect(() => {
    const fp = typingPassages.filter(p => {
      const okDiff = difficulty === 'all' || p.difficulty === difficulty;
      const okCat  = category  === 'all' || p.category  === category;
      return okDiff && okCat;
    });
    const list = fp.length > 0 ? fp : typingPassages;
    setSelectedPassage(list[0]);
  }, [difficulty, category, typingPassages]);

  const passage = selectedPassage?.content || '';
  selectedRef.current = selectedPassage;
  passageRef.current  = passage;

  // Finish Test
  const finishTest = useCallback(() => {
    if (isFinishedRef.current)          return;
    if (phaseRef.current !== 'running') return;
    isFinishedRef.current = true;

    if (timerRef.current)    clearInterval(timerRef.current);
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current);

    const elapsed    = (Date.now() - startTimeRef.current) / 60000;
    const cs         = charStatesRef.current;
    const tt         = typedTextRef.current;
    const errs       = errorsRef.current;
    const hist       = wpmHistoryRef.current;
    const sp         = selectedRef.current;
    const pg         = passageRef.current;
    const md         = modeRef.current;
    const dur        = durationRef.current;

    const totalTyped  = tt.length;
    const grossWpm    = Math.max(0, Math.round(totalTyped / 5 / Math.max(elapsed, 0.001)));
    const netWpm      = Math.max(0, Math.round((totalTyped - errs) / 5 / Math.max(elapsed, 0.001)));
    const correctChars = cs.filter(s => s === 'correct').length;
    const accuracy    = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;
    const ts          = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const finalHistory: WpmPoint[] = [...hist, { time: Math.round(elapsed * 60), wpm: grossWpm }];

    const r: ResultData = {
      netWpm, grossWpm, accuracy, errors: errs, totalTyped,
      elapsedSeconds: Math.round(elapsed * 60),
      mode: md, wpmHistory: finalHistory,
      tabSwitches: tabSwitchRef.current,
      passageTitle: sp.title, difficulty: sp.difficulty,
      charStates: [...cs], passageContent: pg, timestamp: ts,
    };

    setResult(r);
    setPhase('results');

    if (MODE_CONFIG[md].countsTowardPB) {
      try {
        const key      = getPBKey(md, dur);
        const existing = localStorage.getItem(key);
        const pb: PersonalBest | null = existing ? JSON.parse(existing) : null;
        if (!pb || netWpm > pb.netWpm) {
          localStorage.setItem(key, JSON.stringify({ netWpm, accuracy, date: ts }));
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Anti-cheat
  useEffect(() => {
    if (phase !== 'running') return;
    const onHide = () => { if (document.hidden) { tabSwitchRef.current++; setTabSwitches(c => c + 1); } };
    const onBlur = () => { tabSwitchRef.current++; setTabSwitches(c => c + 1); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
    };
  }, [phase]);

  // Timer
  useEffect(() => {
    if (phase !== 'running') return;
    timerRef.current = setInterval(() => setTimeLeft(prev => Math.max(prev - 1, 0)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => { if (phase === 'running' && timeLeft === 0) finishTest(); }, [timeLeft, phase, finishTest]);
  useEffect(() => { if (phase === 'running' && passage.length > 0 && typedText.length >= passage.length) finishTest(); }, [typedText.length, phase, passage.length, finishTest]);

  // WPM sampling
  useEffect(() => {
    if (phase !== 'running') return;
    wpmSampleRef.current = setInterval(() => {
      const el  = (Date.now() - startTimeRef.current) / 60000;
      if (el < 0.01) return;
      const wpm = Math.round(typedTextRef.current.length / 5 / el);
      setWpmHistory(prev => [...prev, { time: Math.round(el * 60), wpm }]);
    }, 5000);
    return () => { if (wpmSampleRef.current) clearInterval(wpmSampleRef.current); };
  }, [phase]);

  // Start
  const startTest = () => {
    if (!passage) return;
    isFinishedRef.current = false;
    tabSwitchRef.current  = 0;
    setTabSwitches(0);
    setTypedText('');
    setErrors(0);
    setCharStates(new Array(passage.length).fill('idle'));
    setTimeLeft(duration * 60);
    setWpmHistory([]);
    setResult(null);
    startTimeRef.current = Date.now();
    setPhase('running');
    setTimeout(() => { inputRef.current?.focus(); setIsFocused(true); }, 80);
  };

  // Reset
  const resetTest = () => {
    if (timerRef.current)    clearInterval(timerRef.current);
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current);
    isFinishedRef.current = false;
    tabSwitchRef.current  = 0;
    setTabSwitches(0);
    setPhase('setup');
    setTypedText('');
    setErrors(0);
    setCharStates([]);
    setTimeLeft(duration * 60);
    setWpmHistory([]);
    setResult(null);
    setIsFocused(false);
    setUserName('');
  };

  // Input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase !== 'running') return;
    const val = e.target.value;
    const isBS = val.length < typedText.length;
    if (mode !== 'practice' && isBS) return;
    if (mode === 'practice' && backspaceLock && isBS) return;
    setTypedText(val);
    setCharStates(prev => {
      const next = [...prev];
      for (let i = 0; i < passage.length; i++) {
        if (i < val.length) next[i] = val[i] === passage[i] ? 'correct' : 'incorrect';
        else next[i] = 'idle';
      }
      return next;
    });
    if (!isBS && val.length > 0 && val.length <= passage.length) {
      const idx = val.length - 1;
      if (val[idx] !== passage[idx]) setErrors(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (phase !== 'running') return;
    const noBS = mode !== 'practice' || (mode === 'practice' && backspaceLock);
    if (e.key === 'Backspace' && noBS) e.preventDefault();
  };

  // Live metrics
  const elapsedMin  = phase === 'running' ? (Date.now() - startTimeRef.current) / 60000 : 0;
  const correctNow  = charStates.filter(s => s === 'correct').length;
  const liveGross   = elapsedMin > 0.05 ? Math.round(typedText.length / 5 / elapsedMin) : 0;
  const liveNet     = elapsedMin > 0.05 ? Math.max(0, Math.round((typedText.length - errors) / 5 / elapsedMin)) : 0;
  const liveAcc     = typedText.length > 0 ? Math.round((correctNow / typedText.length) * 100) : 100;
  const progressPct = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const currWordIdx = typedText.split(' ').length - 1;
  const formatTime  = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  // Timer urgency colors — theme-safe (not using amber/orange text-shadow)
  const timerUrgent = timeLeft < 60 && phase === 'running';
  const timerColor  = timerUrgent ? '#f87171' : 'var(--goti-amber)';
  const timerShadow = timerUrgent
    ? '0 0 14px rgba(248,113,113,0.6), 0 0 28px rgba(248,113,113,0.3)'
    : '0 0 14px rgba(237,158,89,0.5), 0 0 28px rgba(237,158,89,0.25)';

  const cfg = MODE_CONFIG[mode];

  const pb: PersonalBest | null = (() => {
    try {
      const s = localStorage.getItem(getPBKey(mode, duration));
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();

  // Caption copy
  const copyCaption = () => {
    if (!result) return;
    const c = MODE_CONFIG[result.mode];
    const text = [
      `🏆 Just scored ${result.netWpm} Net WPM with ${result.accuracy}% accuracy!`,
      ``,
      `📊 Gross WPM: ${result.grossWpm}  |  Errors: ${result.errors}  |  ${result.difficulty} passage`,
      `💪 Mode: ${c.label} on GotiPrep`,
      userName.trim() ? `👤 By: ${userName.trim()}` : '',
      ``,
      `Preparing for TCS NQT, Banking & SSC typing tests.`,
      `🔗 Practice free: gotiprep.shuvankar.qzz.io`,
      ``,
      `#GotiPrep #TypingTest #TCSNQT #BankingExam #SSCTyping #ExamPrep #GotiPrepChallenge`,
    ].filter(l => l !== null).join('\n');
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); })
      .catch(() => {});
  };

  // Download card as image / print view
  const downloadCard = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const el = document.getElementById('achievement-card-dom');
      if (el) {
        const printWin = window.open('', '_blank');
        if (printWin) {
          printWin.document.write(`<!DOCTYPE html><html><head><title>GotiPrep Score Card</title><style>body{margin:0;background:#0f0c29;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem;}</style></head><body>${el.outerHTML}</body></html>`);
          printWin.document.close();
          setTimeout(() => { printWin.print(); }, 250);
        }
      }
    } catch {
      /* ignore */
    }
    setDownloading(false);
  };

  // Share links
  const buildShareLinks = (r: ResultData) => {
    const name = userName.trim() ? ` by ${userName.trim()}` : '';
    const text = encodeURIComponent(`🏆 I scored ${r.netWpm} Net WPM with ${r.accuracy}% accuracy${name} on GotiPrep! Try it: https://gotiprep.shuvankar.qzz.io #GotiPrep #TypingTest #TCSNQT`);
    const url  = encodeURIComponent('https://gotiprep.shuvankar.qzz.io');
    return {
      whatsapp:  `https://wa.me/?text=${text}`,
      twitter:   `https://twitter.com/intent/tweet?text=${text}`,
      linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      instagram: null, // Instagram doesn't support direct web share
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    };
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      <SEO
        title="Free Online Typing Test Practice — TCS NQT, SSC CHSL, IBPS | GotiPrep"
        description="Practice exam-grade typing speed & accuracy online. Simulated TCS NQT, SSC CGL/CHSL, and Banking typing test environment with net/gross WPM calculations & anti-cheat."
        keywords="SSC CHSL typing test practice online free, TCS NQT typing test, IBPS typing speed test, net WPM calculator, typing arena, GotiPrep"
        path="/typing"
      />

      {/* Mobile Sticky Bottom Bar Ad */}
      <AdSlot type="mobile-sticky" />

      <div className="layout-with-side-ads">
        <AdSlot type="vertical-left" />
        <div className="layout-main-content" style={{ padding: '3rem 1.5rem' }}>

        {/* Banner Ad above Heading */}
        <AdSlot type="banner" slotId="typing-top-banner-ad" style={{ marginBottom: '1.5rem' }} />

        {/* Page header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
            <span className="glow-text-amber">Typing</span> Arena
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Assessment-grade simulator for TCS NQT, SSC, IBPS, and government typing exams.
          </p>
        </div>

        {/* ══════════════════════ SETUP PHASE ══════════════════════════════════ */}
        {phase === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* Step 1: Mode */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                STEP 1 — SELECT MODE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {(Object.entries(MODE_CONFIG) as [TestMode, typeof MODE_CONFIG.practice][]).map(([key, c]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    style={{
                      padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                      border: `2px solid ${mode === key ? c.accent : 'var(--border-color)'}`,
                      background: mode === key ? c.accentBg : 'var(--bg-card)',
                      transition: 'all 0.2s ease',
                      boxShadow: mode === key ? `0 0 28px ${c.accent}18` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: mode === key ? c.accent : 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {c.label}
                      </span>
                      {c.countsTowardPB && (
                        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.05em', background: c.accentBg, color: c.accent, padding: '2px 8px', borderRadius: '100px', border: `1px solid ${c.accentBorder}` }}>
                          RANKED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{c.desc}</div>
                    {key === 'certification' && (
                      <div style={{ marginTop: '7px', fontSize: '0.68rem', color: c.accent, fontFamily: 'var(--font-mono)' }}>
                        ↳ Generates Instagram achievement post 📸
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Steps 2 & 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="card-glow" style={{ padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                  STEP 2 — DURATION
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[1, 3, 5, 10, 15].map(d => (
                    <button key={d} onClick={() => setDuration(d)} style={{
                      padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      border:     `1px solid ${duration === d ? cfg.accent : 'var(--border-color)'}`,
                      background: duration === d ? cfg.accentBg : 'transparent',
                      color:      duration === d ? cfg.accent : 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}>{d} min</button>
                  ))}
                </div>
              </div>

              <div className="card-glow" style={{ padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                  STEP 3 — DIFFICULTY
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(['all', 'easy', 'medium', 'hard'] as DiffFilter[]).map(d => {
                    const dc = DIFF_COLORS[d];
                    const sel = difficulty === d;
                    return (
                      <button key={d} onClick={() => setDifficulty(d)} style={{
                        padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                        border:     `1px solid ${sel ? dc : 'var(--border-color)'}`,
                        background: sel ? `${dc}18` : 'transparent',
                        color:      sel ? dc : 'var(--text-secondary)',
                        transition: 'all 0.2s', textTransform: 'capitalize',
                      }}>{d}</button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Steps 4 & 5 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="card-glow" style={{ padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                  STEP 4 — CATEGORY & PASSAGE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {allCategories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer',
                      border:     `1px solid ${category === cat ? cfg.accent : 'var(--border-color)'}`,
                      background: category === cat ? cfg.accentBg : 'transparent',
                      color:      category === cat ? cfg.accent : 'var(--text-muted)',
                      textTransform: 'capitalize', transition: 'all 0.15s',
                    }}>{cat}</button>
                  ))}
                </div>
                <select
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
                  value={selectedPassage?.id}
                  onChange={e => {
                    const p = filteredPassages.find(x => x.id === e.target.value);
                    if (p) setSelectedPassage(p);
                  }}
                >
                  {filteredPassages.map(p => (
                    <option key={p.id} value={p.id}>{p.title} — {p.difficulty}</option>
                  ))}
                </select>
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {selectedPassage?.content.slice(0, 110)}…
                </div>
              </div>

              <div className="card-glow" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                  STEP 5 — PRACTICE SETTINGS
                  {mode !== 'practice' && <span style={{ color: '#f87171', fontSize: '0.58rem', marginLeft: '6px' }}>LOCKED</span>}
                </div>
                {mode !== 'practice' && (
                  <div style={{ position: 'absolute', inset: '0 0 0 0', top: '2.5rem', background: 'var(--bg-card)', opacity: 0.7, zIndex: 2, borderRadius: '0 0 12px 12px', pointerEvents: 'all' }} />
                )}
                {[
                  { id: 'bs',    label: 'Backspace Lock', desc: 'Disables delete (auto-on in exam/challenge)', val: mode !== 'practice' ? true : backspaceLock, set: setBackspaceLock },
                  { id: 'wh',    label: 'Word Highlight',  desc: 'Highlights current word being typed',       val: wordHighlight,                               set: setWordHighlight },
                  { id: 'blind', label: 'Blind Mode',      desc: 'Hides error colors (auto-on in exam/challenge)', val: mode !== 'practice' ? true : blindMode, set: setBlindMode },
                ].map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.desc}</div>
                    </div>
                    <label className="toggle-switch" style={{ flexShrink: 0, opacity: mode !== 'practice' ? 0.45 : 1 }}>
                      <input type="checkbox" checked={t.val} disabled={mode !== 'practice'} onChange={() => mode === 'practice' && t.set(!t.val)} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={startTest}
                style={{
                  fontSize: '1rem', padding: '15px 36px', borderRadius: '10px',
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: cfg.accent,
                  color: '#ffffff',
                  border: 'none',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${cfg.accent}44`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
              >
                <Play size={20} /> Start {cfg.label}
              </button>
              {pb && cfg.countsTowardPB && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  🏅 PB: <span style={{ color: cfg.accent, fontWeight: 700 }}>{pb.netWpm} WPM</span> ({pb.accuracy}%) — {pb.date}
                </div>
              )}
            </div>

            <AdSlot type="banner" slotId="typing-setup-ad" style={{ borderRadius: '10px' }} />
          </div>
        )}

        {/* ══════════════════════ RUNNING PHASE ════════════════════════════════ */}
        {phase === 'running' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Mode badge + tab warning */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '100px', border: `1px solid ${cfg.accentBorder}`, background: cfg.accentBg, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: cfg.accent, textTransform: 'uppercase' }}>
                {cfg.icon} {cfg.label} · {duration} MIN · {selectedPassage.difficulty}
              </div>
              {tabSwitches > 0 && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '100px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600 }}>
                  ⚠ Tab switch: {tabSwitches}×
                </div>
              )}
            </div>

            {/* Live Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {[
                { label: 'Net WPM',   value: liveNet,                                           note: 'exam-grade', color: cfg.accent },
                { label: 'Gross WPM', value: liveGross,                                         note: 'raw speed',  color: '#34d399' },
                { label: 'Accuracy',  value: `${liveAcc}%`,                                     note: '',           color: '#FFD700' },
                { label: 'Errors',    value: (mode !== 'practice' && blindMode) ? '—' : errors, note: blindMode ? 'blind' : '', color: '#f87171' },
                { label: 'Time Left', value: formatTime(timeLeft),                               note: '',           color: timerColor },
              ].map(m => (
                <div key={m.label} style={{ background: 'var(--bg-card)', border: `1px solid ${m.label === 'Time Left' && timerUrgent ? 'rgba(248,113,113,0.4)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 700, color: m.color, lineHeight: 1,
                    textShadow: m.label === 'Time Left' ? timerShadow : 'none',
                  }}>{m.value}</div>
                  {m.note && <div style={{ fontSize: '0.55rem', color: m.color, fontFamily: 'var(--font-mono)', marginTop: 1, opacity: 0.6 }}>{m.note}</div>}
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ height: '3px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${cfg.accent}, ${cfg.accent}bb)`, transition: 'width 1s linear', borderRadius: '2px' }} />
            </div>

            {/* Typing Zone */}
            <div
              className="typing-passage"
              onClick={() => { inputRef.current?.focus(); setIsFocused(true); }}
              style={{ cursor: 'text', position: 'relative', minHeight: '180px', userSelect: 'none' }}
            >
              {!isFocused && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(3px)', borderRadius: 'inherit', zIndex: 5, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', gap: '8px' }}>
                  Click to focus
                </div>
              )}
              {passage.split('').map((char, i) => {
                const st      = charStates[i] || 'idle';
                const isCur   = i === typedText.length;
                const isTyped = i < typedText.length;
                const inWord  = wordHighlight && (() => {
                  let w = 0;
                  for (let j = 0; j < passage.length; j++) {
                    if (passage[j] === ' ') w++;
                    if (j === i) return w === currWordIdx;
                  }
                  return false;
                })();

                let color: string = 'var(--text-muted)';
                let bg: string | undefined;
                let underline = false;
                let borderBot: string | undefined;

                if (isCur) {
                  bg       = `${cfg.accent}28`;
                  borderBot = `2px solid ${cfg.accent}`;
                  color    = 'var(--text-primary)';
                } else if (isTyped) {
                  color = blindMode ? 'var(--text-secondary)' : st === 'correct' ? '#34d399' : '#f87171';
                  if (!blindMode && st === 'incorrect') underline = true;
                } else {
                  color = inWord ? 'var(--text-primary)' : 'var(--text-muted)';
                  bg    = inWord ? `${cfg.accent}08` : undefined;
                }

                return (
                  <span key={i} style={{ color, background: bg, borderBottom: borderBot, textDecoration: underline ? 'underline' : undefined, textDecorationColor: '#f87171' }}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onPaste={e => e.preventDefault()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              style={{ position: 'fixed', opacity: 0, pointerEvents: 'auto', width: 1, height: 1, top: 0, left: 0, zIndex: -1 }}
              aria-label="Typing input"
            />

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={resetTest} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <RotateCcw size={15} /> Reset
              </button>
              <button
                onClick={finishTest}
                style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 600, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)', color: '#f87171' }}
              >
                Finish Early
              </button>
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {typedText.length} / {passage.length} chars
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ RESULTS PHASE ════════════════════════════════ */}
        {phase === 'results' && result && (() => {
          const rcfg = MODE_CONFIG[result.mode];
          const shareLinks = buildShareLinks(result);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: 0 }}>
                  Test Complete <span style={{ color: rcfg.accent }}>✓</span>
                </h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '100px', border: `1px solid ${rcfg.accentBorder}`, background: rcfg.accentBg, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: rcfg.accent }}>
                  {rcfg.icon} {rcfg.label}
                </div>
                {result.tabSwitches > 0 && (
                  <div style={{ padding: '5px 12px', borderRadius: '100px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600 }}>
                    ⚠ {result.tabSwitches} tab switch{result.tabSwitches > 1 ? 'es' : ''} flagged
                  </div>
                )}
              </div>

              {/* Primary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {[
                  { label: 'Net WPM',   value: result.netWpm,             accent: rcfg.accent, note: 'exam-grade' },
                  { label: 'Gross WPM', value: result.grossWpm,           accent: '#34d399',   note: 'raw speed'  },
                  { label: 'Accuracy',  value: `${result.accuracy}%`,     accent: '#FFD700',   note: ''           },
                  { label: 'Errors',    value: result.errors,             accent: '#f87171',   note: ''           },
                  { label: 'Duration',  value: `${result.elapsedSeconds}s`, accent: '#b06fd6', note: ''           },
                ].map(m => (
                  <div key={m.label} className="card-glow" style={{ padding: '1.1rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: m.accent, lineHeight: 1 }}>{m.value}</div>
                    {m.note && <div style={{ fontSize: '0.58rem', color: m.accent, fontFamily: 'var(--font-mono)', marginTop: 2, opacity: 0.7 }}>{m.note}</div>}
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* PB */}
              {pb && rcfg.countsTowardPB && (
                <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', border: `1px solid ${rcfg.accentBorder}`, background: rcfg.accentBg, display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: rcfg.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🏅 Personal Best</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {pb.netWpm} Net WPM &nbsp;·&nbsp; {pb.accuracy}% &nbsp;·&nbsp; {pb.date}
                  </div>
                  {result.netWpm >= pb.netWpm && (
                    <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                      🎉 NEW PERSONAL BEST!
                    </div>
                  )}
                </div>
              )}

              {/* WPM Graph + Diff View */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div className="card-glow" style={{ padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>WPM OVER TIME</div>
                  <SparklineGraph data={result.wpmHistory} accent={rcfg.accent} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>0s</span><span>{result.elapsedSeconds}s</span>
                  </div>
                </div>
                <div className="card-glow" style={{ padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    TYPED vs ACTUAL <span style={{ fontSize: '0.58rem', opacity: 0.6 }}>(first 140 chars)</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.77rem', lineHeight: 1.9, wordBreak: 'break-all' }}>
                    {result.passageContent.slice(0, 140).split('').map((char, i) => {
                      const st = i < result.charStates.length ? result.charStates[i] : 'idle';
                      return (
                        <span key={i} style={{ color: st === 'correct' ? '#34d399' : st === 'incorrect' ? '#f87171' : 'var(--text-muted)', background: st === 'incorrect' ? 'rgba(248,113,113,0.1)' : undefined, opacity: st === 'idle' ? 0.35 : 1 }}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                    <span style={{ color: '#34d399' }}>● Correct</span>
                    <span style={{ color: '#f87171' }}>● Error</span>
                    <span style={{ color: 'var(--text-muted)', opacity: 0.45 }}>● Not reached</span>
                  </div>
                </div>
              </div>

              {/* ── Instagram Achievement Post ── */}
              <div className="card-glow" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>📸</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      YOUR ACHIEVEMENT POST
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Download the card → share on any platform 🚀
                    </div>
                  </div>
                </div>

                {/* Name input */}
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Enter your name (optional)"
                    maxLength={28}
                    style={{
                      padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                      outline: 'none', flex: 1, maxWidth: '260px',
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Shows on card & caption</span>
                </div>

                {/* Achievement card */}
                <AchievementCard result={result} userName={userName} />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Download */}
                  <button
                    onClick={downloadCard}
                    disabled={downloading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '10px 20px', borderRadius: '8px', cursor: downloading ? 'wait' : 'pointer',
                      fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: '#ffffff', border: 'none',
                      boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
                      opacity: downloading ? 0.7 : 1, transition: 'all 0.2s',
                    }}
                  >
                    <Download size={14} /> {downloading ? 'Preparing…' : 'Download Card'}
                  </button>

                  {/* Copy caption */}
                  <button
                    onClick={copyCaption}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '10px 18px', borderRadius: '8px', cursor: 'pointer',
                      fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                      border: `1px solid ${copied ? '#34d399' : rcfg.accentBorder}`,
                      background: copied ? 'rgba(52,211,153,0.1)' : rcfg.accentBg,
                      color: copied ? '#34d399' : rcfg.accent, transition: 'all 0.2s',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Caption'}
                  </button>
                </div>

                {/* Share row */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Share2 size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SHARE VIA:</span>
                  {[
                    { name: 'WhatsApp',  href: shareLinks.whatsapp,  bg: '#25D366', color: '#fff' },
                    { name: 'Twitter/X', href: shareLinks.twitter,   bg: '#1DA1F2', color: '#fff' },
                    { name: 'LinkedIn',  href: shareLinks.linkedin,  bg: '#0A66C2', color: '#fff' },
                    { name: 'Facebook',  href: shareLinks.facebook,  bg: '#1877F2', color: '#fff' },
                  ].map(s => (
                    <a
                      key={s.name}
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700,
                        background: s.bg, color: s.color,
                        textDecoration: 'none', fontFamily: 'var(--font-mono)',
                        boxShadow: `0 2px 8px ${s.bg}44`,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
                    >
                      {s.name}
                    </a>
                  ))}
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    📸 For Instagram: download card → upload as story/post
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={resetTest}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 28px', borderRadius: '8px',
                    background: rcfg.accent, color: '#ffffff', border: 'none',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: `0 4px 14px ${rcfg.accent}44`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
                >
                  <RotateCcw size={16} /> Try Again
                </button>
                <button className="btn-secondary" onClick={resetTest}>Change Settings</button>
              </div>

              <AdSlot type="banner" slotId="typing-result-ad" style={{ borderRadius: '10px' }} />
            </div>
          );
        })()}

        {/* Bottom Banner Ad before Footer */}
        <AdSlot type="banner" slotId="typing-bottom-banner-ad" style={{ marginTop: '2.5rem' }} />
        </div>
        <AdSlot type="vertical-right" />
      </div>
    </div>
  );
};

export default TypingPractice;
