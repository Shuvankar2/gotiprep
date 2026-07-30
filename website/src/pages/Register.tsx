import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#f87171', '#ED9E59', '#60a5fa', '#34d399'];
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = register(name.trim(), email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: -200, right: -200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,34,73,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(68,23,78,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" className="logo-glow" style={{ fontSize: '2rem', textDecoration: 'none', display: 'inline-block', marginBottom: '6px' }}>
            GotiPrep
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your free account</p>
        </div>

        {/* Benefits strip */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['Track Progress', 'Earn Badges', 'Share Results'].map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <CheckCircle size={12} style={{ color: '#34d399' }} /> {b}
            </div>
          ))}
        </div>

        <div className="card-glow" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.75rem', textAlign: 'center' }}>
            Create Account 🚀
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input id="name" type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" required autoComplete="name" />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">Email address</label>
              <input id="reg-email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '100px', background: i <= strength ? strengthColors[strength] : 'var(--border-color)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm" className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input id="confirm" type={showPw ? 'text' : 'password'} className="form-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required autoComplete="new-password" style={{ paddingRight: '44px' }} />
                {confirm && (
                  <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: confirm === password ? '#34d399' : '#f87171' }}>
                    {confirm === password ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating account…</>
                ) : (
                  <><UserPlus size={18} /> Create Free Account</>
                )}
              </span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--goti-amber)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Continue without account</Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(245,238,248,0.3)', marginTop: '1.5rem' }}>
          A product by <span className="suvnkr-brand" style={{ fontSize: '0.75rem' }}>SUVNKR</span>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
