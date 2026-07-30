import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate latency
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: -200, left: -200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(68,23,78,0.35) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,64,84,0.25) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" className="logo-glow" style={{ fontSize: '2rem', textDecoration: 'none', display: 'inline-block', marginBottom: '6px' }}>
            GotiPrep
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to track your progress</p>
        </div>

        {/* Card */}
        <div className="card-glow" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.75rem', textAlign: 'center' }}>
            Welcome Back 👋
          </h2>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '10px',
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
              color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Signing in…
                  </>
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--goti-amber)', textDecoration: 'none', fontWeight: 600 }}>
                Create one free
              </Link>
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              ← Continue without account
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(245,238,248,0.3)', marginTop: '1.5rem' }}>
          A product by <span className="suvnkr-brand" style={{ fontSize: '0.75rem' }}>SUVNKR</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
