import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, LogOut, LayoutDashboard, BookOpen, PenTool,
  MessageSquare, Keyboard, Plus, Trash2, Pencil, Save, X,
  Eye, EyeOff, AlertCircle,
  CheckCircle, Settings
} from 'lucide-react';
import { useAdminStore, ADMIN_CREDENTIALS } from '../store/adminStore';
import type { Passage } from '../data/passages';
import type { SentenceItem } from '../data/sentences';
import type { EmailPrompt } from '../data/emailPrompts';
import type { TypingPassage } from '../data/typingPassages';

type AdminSection = 'dashboard' | 'typing' | 'passages' | 'sentences' | 'emails' | 'settings';

const Admin: React.FC = () => {
  const {
    isAdminAuthenticated, adminLogin, adminLogout,
    passages, sentences, emailPrompts, typingPassages,
    addPassage, updatePassage, deletePassage,
    addSentence, updateSentence, deleteSentence,
    addEmailPrompt, updateEmailPrompt, deleteEmailPrompt,
    addTypingPassage, updateTypingPassage, deleteTypingPassage,
  } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Record<string, unknown>>({});
  const [adding, setAdding] = useState(false);
  const [newBuffer, setNewBuffer] = useState<Record<string, unknown>>({});
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Login form ───────────────────────────────────────
  if (!isAdminAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      setLoginLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      const res = adminLogin(email, password);
      setLoginLoading(false);
      if (!res.success) setLoginError(res.message);
    };

    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem 1rem' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, top: -200, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,64,84,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '16px', background: 'linear-gradient(135deg, #A34054, #44174E)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(163,64,84,0.4)' }}>
              <Shield size={28} style={{ color: '#fff' }} />
            </div>
            <div className="logo-glow" style={{ fontSize: '1.8rem', display: 'block', marginBottom: '4px' }}>GotiPrep</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Super Admin Access</p>
          </div>

          <div className="card-glow" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
              Admin Sign In 🛡️
            </h2>

            {loginError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gotiprep.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" required style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px', opacity: loginLoading ? 0.7 : 1 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loginLoading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Verifying…</> : <><Shield size={16} /> Access Admin Panel</>}
                </span>
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(237,158,89,0.05)', border: '1px solid rgba(237,158,89,0.15)', borderRadius: '10px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '6px' }}>Default credentials</p>
              <code style={{ fontSize: '0.75rem', color: 'var(--goti-amber)', display: 'block', textAlign: 'center' }}>
                admin@gotiprep.com / GotiPrep@123
              </code>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to GotiPrep</Link>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Admin Dashboard ──────────────────────────────────

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'typing', label: 'Typing Passages', icon: <Keyboard size={18} /> },
    { id: 'passages', label: 'Passages', icon: <BookOpen size={18} /> },
    { id: 'sentences', label: 'Sentences', icon: <PenTool size={18} /> },
    { id: 'emails', label: 'Email Prompts', icon: <MessageSquare size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const renderDashboard = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Typing Passages', value: typingPassages.length, color: '#ED9E59', icon: <Keyboard size={20} /> },
          { label: 'Passages', value: passages.length, color: '#b06fd6', icon: <BookOpen size={20} /> },
          { label: 'Sentence Items', value: sentences.length, color: '#A34054', icon: <PenTool size={20} /> },
          { label: 'Email Prompts', value: emailPrompts.length, color: '#34d399', icon: <MessageSquare size={20} /> },
        ].map((s) => (
          <div key={s.label} className="card-glow" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: s.color }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card-glow" style={{ padding: '1.5rem', background: 'rgba(52,211,153,0.05)', borderColor: 'rgba(52,211,153,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#34d399' }}>
          <CheckCircle size={18} /> <span style={{ fontWeight: 700 }}>System Status</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          All modules are operational. Data is stored in localStorage (pre-MongoDB phase).
          Admin credentials: <code style={{ color: 'var(--goti-amber)' }}>admin@gotiprep.com / GotiPrep@123</code>
        </p>
      </div>
    </div>
  );

  // Generic CRUD table for a content type
  const renderCRUD = <T extends { id: string }>(
    items: T[],
    fields: { key: keyof T; label: string; type?: string; options?: string[] }[],
    onAdd: (item: Omit<T, 'id'>) => void,
    onUpdate: (id: string, item: Partial<T>) => void,
    onDelete: (id: string) => void,
    title: string,
    emptyNew: Omit<T, 'id'>
  ) => {
    const startEdit = (item: T) => { setEditingId(item.id); setEditBuffer({ ...item }); setAdding(false); };
    const cancelEdit = () => { setEditingId(null); setEditBuffer({}); };
    const saveEdit = () => {
      if (editingId) { onUpdate(editingId, editBuffer as Partial<T>); cancelEdit(); showToast('✅ Updated!'); }
    };
    const startAdd = () => { setAdding(true); setNewBuffer({ ...emptyNew }); setEditingId(null); };
    const saveNew = () => { onAdd(newBuffer as Omit<T, 'id'>); setAdding(false); setNewBuffer({}); showToast('✅ Added!'); };
    const cancelAdd = () => { setAdding(false); setNewBuffer({}); };
    const handleDelete = (id: string) => { if (confirm('Delete this item?')) { onDelete(id); showToast('🗑️ Deleted!'); } };

    const renderField = (key: string, _val: unknown, buf: Record<string, unknown>, setBuf: (b: Record<string, unknown>) => void, field: typeof fields[0]) => {
      if (field.options) {
        return (
          <select className="form-input" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={(buf[key] as string) || ''} onChange={(e) => setBuf({ ...buf, [key]: e.target.value })}>
            {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        );
      }
      if (field.type === 'textarea') {
        return <textarea className="form-input form-textarea" style={{ minHeight: 80, fontSize: '0.85rem', resize: 'vertical' }} value={(buf[key] as string) || ''} onChange={(e) => setBuf({ ...buf, [key]: e.target.value })} />;
      }
      return <input className="form-input" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={(buf[key] as string) || ''} onChange={(e) => setBuf({ ...buf, [key]: e.target.value })} />;
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{title}</h2>
          <button className="btn-primary" onClick={startAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '0.875rem' }}>
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="card-glow" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.04)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#34d399' }}>Add New Item</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              {fields.map((f) => (
                <div key={String(f.key)} className="form-group">
                  <label className="form-label">{f.label}</label>
                  {renderField(String(f.key), newBuffer[String(f.key)], newBuffer, setNewBuffer, f)}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={saveNew} style={{ padding: '8px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={14} /> Save
              </button>
              <button className="btn-secondary" onClick={cancelAdd} style={{ padding: '8px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => (
            <div key={item.id} className="card-glow" style={{ padding: '1.25rem' }}>
              {editingId === item.id ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    {fields.map((f) => (
                      <div key={String(f.key)} className="form-group">
                        <label className="form-label">{f.label}</label>
                        {renderField(String(f.key), (item as Record<string, unknown>)[String(f.key)], editBuffer, setEditBuffer, f)}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={saveEdit} style={{ padding: '8px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Save size={14} /> Save
                    </button>
                    <button className="btn-secondary" onClick={cancelEdit} style={{ padding: '8px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {fields.slice(0, 3).map((f) => (
                      <div key={String(f.key)} style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}: </span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'inline' }}>
                          {String((item as Record<string, unknown>)[String(f.key)] || '').substring(0, 120)}{String((item as Record<string, unknown>)[String(f.key)] || '').length > 120 ? '…' : ''}
                        </span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {fields.slice(3).filter(f => !f.type || f.type !== 'textarea').map((f) => (
                        <span key={String(f.key)} className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          {f.label}: {String((item as Record<string, unknown>)[String(f.key)] || '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button className="btn-ghost" onClick={() => startEdit(item)} style={{ color: 'var(--goti-amber)', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <Pencil size={15} />
                    </button>
                    <button className="btn-ghost" onClick={() => handleDelete(item.id)} style={{ color: '#f87171', padding: '8px', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No items yet. Add one above.</div>}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Settings</h2>
      <div className="card-glow" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Admin Account</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { label: 'Name', value: ADMIN_CREDENTIALS.name },
            { label: 'Email', value: ADMIN_CREDENTIALS.email },
            { label: 'Role', value: ADMIN_CREDENTIALS.role.toUpperCase() },
          ].map((r) => (
            <div key={r.label} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', width: '80px', flexShrink: 0 }}>{r.label}:</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: r.label === 'Role' ? 'var(--font-mono)' : 'inherit' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card-glow" style={{ padding: '1.5rem', borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' }}>
        <h3 style={{ fontWeight: 700, color: '#f87171', marginBottom: '8px', fontSize: '1rem' }}>⚠️ Data Notice</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Currently using localStorage (pre-MongoDB phase). All data resets if browser storage is cleared.
          Migrate to MongoDB Atlas when ready.
        </p>
        <button className="btn-secondary" onClick={() => { if (confirm('Reset all content to seeded defaults?')) { window.location.reload(); } }} style={{ fontSize: '0.875rem', padding: '8px 16px', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return renderDashboard();
      case 'typing': return renderCRUD<TypingPassage>(
        typingPassages,
        [
          { key: 'title', label: 'Title' },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'category', label: 'Category', options: ['general', 'tech', 'nature', 'history', 'science'] },
          { key: 'difficulty', label: 'Difficulty', options: ['easy', 'medium', 'hard'] },
        ],
        addTypingPassage, updateTypingPassage, deleteTypingPassage,
        'Typing Passages',
        { title: '', content: '', category: 'general', difficulty: 'medium' }
      );
      case 'passages': return renderCRUD<Passage>(
        passages,
        [
          { key: 'title', label: 'Title' },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'category', label: 'Category', options: ['general', 'tech', 'banking', 'current-affairs', 'science'] },
          { key: 'difficulty', label: 'Difficulty', options: ['easy', 'medium', 'hard'] },
          { key: 'wordCount', label: 'Word Count' },
        ],
        addPassage, updatePassage, deletePassage,
        'Unseen Passages',
        { title: '', content: '', category: 'general', difficulty: 'medium', wordCount: 100 }
      );
      case 'sentences': return renderCRUD<SentenceItem>(
        sentences,
        [
          { key: 'sentence', label: 'Sentence (use _____ for blank)' },
          { key: 'blank', label: 'Answer' },
          { key: 'hint', label: 'Hint' },
          { key: 'explanation', label: 'Explanation', type: 'textarea' },
          { key: 'category', label: 'Category', options: ['grammar', 'vocabulary', 'idioms', 'banking', 'general'] },
          { key: 'difficulty', label: 'Difficulty', options: ['easy', 'medium', 'hard'] },
        ],
        addSentence, updateSentence, deleteSentence,
        'Sentence Completion Items',
        { sentence: '', blank: '', hint: '', explanation: '', category: 'vocabulary', difficulty: 'medium' }
      );
      case 'emails': return renderCRUD<EmailPrompt>(
        emailPrompts,
        [
          { key: 'title', label: 'Title' },
          { key: 'scenario', label: 'Scenario', type: 'textarea' },
          { key: 'category', label: 'Category', options: ['professional', 'complaint', 'request', 'apology', 'inquiry', 'banking'] },
          { key: 'difficulty', label: 'Difficulty', options: ['easy', 'medium', 'hard'] },
        ],
        (item) => addEmailPrompt({ ...item, keyPoints: [] }),
        updateEmailPrompt, deleteEmailPrompt,
        'Email Writing Prompts',
        { title: '', scenario: '', keyPoints: [], category: 'professional', difficulty: 'medium' }
      );
      case 'settings': return renderSettings();
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)',
          color: '#34d399', padding: '12px 20px', borderRadius: '12px',
          fontWeight: 600, fontSize: '0.875rem', backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'rgba(13,11,26,0.95)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className="logo-glow" style={{ fontSize: '1.3rem', display: 'block', marginBottom: '2px' }}>GotiPrep</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <Shield size={12} style={{ color: 'var(--goti-coral)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--goti-coral)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Super Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setEditingId(null); setAdding(false); }}
              className={`admin-nav-item ${section === item.id ? 'active' : ''}`}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/" className="admin-nav-item" style={{ display: 'flex', fontSize: '0.85rem', marginBottom: '8px', textDecoration: 'none' }}>
            ← Back to Site
          </Link>
          <button onClick={adminLogout} className="admin-nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minHeight: '100vh' }}>
        {renderSection()}
      </main>
    </div>
  );
};

export default Admin;
