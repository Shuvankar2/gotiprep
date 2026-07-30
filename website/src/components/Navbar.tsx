import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;
    let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (isLanding) {
        setNavVisible(true);
        return;
      }

      if (currentScrollY <= 20) {
        setNavVisible(true);
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
        if (scrollEndTimeout) { clearTimeout(scrollEndTimeout); scrollEndTimeout = null; }
        return;
      }

      const isScrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);

      if (isScrollingDown) {
        if (!hideTimeout) {
          hideTimeout = setTimeout(() => { setNavVisible(false); }, 2000);
        }
      } else {
        setNavVisible(true);
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
      }

      scrollEndTimeout = setTimeout(() => {
        setNavVisible(true);
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
      }, 250);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
    };
  }, [location.pathname, isLanding]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/typing', label: 'TYPING ARENA' },
    { to: '/passage', label: 'UNSEEN PASSAGE' },
    { to: '/sentences', label: 'SENTENCE CLOZE' },
    { to: '/email', label: 'EMAIL DRAFTING' },
  ];

  const headerBg = scrolled || !isLanding
    ? 'var(--nav-bg)'
    : theme === 'light'
      ? 'rgba(248, 238, 238, 0.3)'
      : 'transparent';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        borderBottom: '1px solid var(--border-color)',
        background: headerBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.35s ease',
        transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: navVisible ? 1 : 0,
      }}>
        <nav style={{
          maxWidth: '1440px', margin: '0 auto',
          padding: '0 2rem',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '2rem',
        }}>
          {/* Logo — Boxed like ApeChain */}
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              border: '2px solid var(--text-primary)',
              padding: '6px 14px',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1,
              display: 'flex', alignItems: 'center',
            }}>
              GOTIPREP
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0', flex: 1, justifyContent: 'center' }}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '0 1.25rem',
                  height: '64px',
                  display: 'flex', alignItems: 'center',
                  borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 36, height: 36,
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '4px', transition: 'all 0.2s ease',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Auth — Desktop */}
            <div className="nav-auth-desktop">
              {isAuthenticated && user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      padding: '8px 16px',
                      border: '1px solid var(--border-color)',
                      background: 'transparent', color: 'var(--text-primary)',
                      cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s ease',
                    }}
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link to="/login" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '8px 16px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent', color: 'var(--text-primary)',
                    textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease',
                  }}>
                    LOG IN
                  </Link>
                  <Link to="/register" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '8px 16px',
                    background: 'var(--text-primary)', color: 'var(--bg-primary)',
                    border: 'none', borderRadius: '4px', textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}>
                    GET STARTED
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger button */}
            <button
              className="menu-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                width: 38, height: 38,
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown with Smooth Animation */}
        <div style={{
          maxHeight: menuOpen ? '420px' : '0px',
          opacity: menuOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: menuOpen ? '1px solid var(--border-color)' : '1px solid transparent',
          padding: menuOpen ? '1.25rem 2rem' : '0rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                textDecoration: 'none', padding: '12px 0',
                borderBottom: '1px solid var(--border-color)',
                transition: 'color 0.2s ease',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            {isAuthenticated && user ? (
              <button onClick={handleLogout} style={{
                flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '12px', border: '1px solid var(--border-color)',
                background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '4px',
              }}>
                LOGOUT
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '12px', border: '1px solid var(--border-color)',
                  background: 'transparent', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '4px',
                }}>
                  LOG IN
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)',
                  textDecoration: 'none', borderRadius: '4px', border: 'none',
                }}>
                  GET STARTED
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-auth-desktop { display: none !important; }
          .menu-toggle-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
