import React, { useContext } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, LogOut, Activity, Sun, Moon } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const TechnicianLayout = () => {
  const { currentUser, logout, language, setLanguage, darkMode, setDarkMode, t, loading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (loading) return;
    if (!currentUser) navigate('/login');
    else if (currentUser.role !== 'TECHNICIAN') navigate('/admin/dashboard');
  }, [currentUser, navigate, loading]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => {
    if (path === '/technician/jobs') return location.pathname.startsWith('/technician/jobs');
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--bg-app)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
            <Activity size={20} color="white" />
          </div>
          <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm font-600" style={{ color: 'var(--text-secondary)' }}>Loading field console...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const navItems = [
    { to: '/technician/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/technician/jobs',      icon: Briefcase,       label: 'Jobs' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>

      {/* ── TOP HEADER ── */}
      <header className="h-14 sticky top-0 z-20 shrink-0 flex items-center justify-between px-4"
        style={{ background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>

        {/* Logo */}
        <Link to="/technician/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
            <Activity size={16} color="white" />
          </div>
          <span className="text-sm font-800 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            FIELD<span className="gradient-text">FLOW</span>
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--border-color)' }}>
            {['en', 'hi'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="px-2 py-1 rounded-md text-[10px] font-700 cursor-pointer transition-all"
                style={language === lang
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { background: 'transparent', color: 'var(--text-secondary)' }}
              >
                {lang === 'en' ? 'EN' : 'हिन्दी'}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-all"
            style={{ background: 'var(--bg-surface-soft)', color: 'var(--text-secondary)', border: 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface-soft)'}
          >
            {darkMode ? <Sun size={16} style={{ color: '#F59E0B' }} /> : <Moon size={16} />}
          </button>

          {/* Role badge */}
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-600"
            style={{ background: 'rgba(14,165,233,0.1)', color: 'var(--primary)', border: '1px solid rgba(14,165,233,0.2)' }}>
            {t('roleTech') || 'Technician'}
          </span>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-700 text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <div className="page-transition">
          <Outlet />
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 md:hidden flex items-center z-30"
        style={{ background: 'var(--bg-topbar)', borderTop: '1px solid var(--border-color)', boxShadow: '0 -4px 16px rgba(15,23,42,0.08)' }}>

        {navItems.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all"
              style={{ color: active ? 'var(--primary)' : 'var(--text-muted)', textDecoration: 'none' }}>
              <Icon size={22} />
              <span className="text-[10px] font-700 uppercase tracking-wider">{label}</span>
              {active && <span className="absolute bottom-0 w-6 h-0.5 rounded-full" style={{ background: 'var(--primary)' }} />}
            </Link>
          );
        })}

        <button onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 cursor-pointer transition-all"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <LogOut size={22} />
          <span className="text-[10px] font-700 uppercase tracking-wider">Exit</span>
        </button>
      </nav>

      {/* ── DESKTOP FOOTER NAV ── */}
      <footer className="hidden md:flex justify-center gap-8 py-3 text-xs"
        style={{ background: 'var(--bg-sidebar)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {navItems.map(({ to, label }) => (
          <Link key={to} to={to}
            className="transition-colors"
            style={{ color: isActive(to) ? '#06B6D4' : '#64748B', textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = isActive(to) ? '#06B6D4' : '#64748B'}>
            {label}
          </Link>
        ))}
        <button onClick={handleLogout}
          className="cursor-pointer transition-colors"
          style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 600, fontSize: '0.75rem', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
          Sign Out
        </button>
      </footer>
    </div>
  );
};

export default TechnicianLayout;
