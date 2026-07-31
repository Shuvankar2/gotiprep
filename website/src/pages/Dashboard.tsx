import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Keyboard, BookOpen, PenTool, MessageSquare, Trophy, LogOut } from 'lucide-react';
import SEO from '../components/SEO';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const modules = [
    { to: '/typing', icon: <Keyboard size={20} />, label: 'Typing Practice', color: '#ED9E59' },
    { to: '/passage', icon: <BookOpen size={20} />, label: 'Passage Practice', color: '#b06fd6' },
    { to: '/sentences', icon: <PenTool size={20} />, label: 'Sentence Completion', color: '#A34054' },
    { to: '/email', icon: <MessageSquare size={20} />, label: 'Email Writing', color: '#34d399' },
  ];

  return (
    <div className="page-container">
      <SEO
        title="User Dashboard & Exam Progress Analytics | GotiPrep"
        description="Track your Typing WPM, passage reading accuracy, cloze test scores, and email writing performance analytics on GotiPrep."
        keywords="exam progress analytics, typing WPM dashboard, GotiPrep user profile"
        path="/dashboard"
      />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Welcome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: '8px' }}>
              Hello, <span className="glow-text-amber">{user.name.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Ready to practice? Start a session from the modules below.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', padding: '9px 18px' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats (placeholder — will be real with backend) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Sessions Today', value: '0', accent: '#ED9E59' },
            { label: 'Best WPM', value: '—', accent: '#b06fd6' },
            { label: 'Day Streak', value: '1', accent: '#34d399' },
            { label: 'Badges Earned', value: '0', accent: '#60a5fa' },
          ].map((s) => (
            <div key={s.label} className="card-glow" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: s.accent, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Quick Start Practice</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {modules.map((m) => (
            <Link key={m.to} to={m.to} className="module-card" style={{ padding: '1.5rem', gap: '12px' }}>
              <div style={{ color: m.color, display: 'flex', alignItems: 'center', gap: '10px' }}>
                {m.icon}
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.label}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: m.color, fontWeight: 600 }}>Start Practice →</div>
            </Link>
          ))}
        </div>

        {/* Achievements placeholder */}
        <div className="card-glow" style={{ padding: '2rem', textAlign: 'center' }}>
          <Trophy size={40} style={{ color: 'rgba(237,158,89,0.3)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Achievements Coming Soon</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Complete practice sessions to earn badges and streak rewards. Your progress will appear here.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🏆 First Session', '🔥 7-Day Streak', '⚡ 60 WPM', '✉️ Email Pro', '📖 Passage Master'].map((b) => (
              <div key={b} style={{
                padding: '8px 16px', borderRadius: '100px', fontSize: '0.8rem',
                background: 'rgba(163,64,84,0.08)', border: '1px solid rgba(163,64,84,0.2)',
                color: 'var(--text-muted)', filter: 'grayscale(1)', opacity: 0.5,
              }}>
                {b}
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(245,238,248,0.3)' }}>
          Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
