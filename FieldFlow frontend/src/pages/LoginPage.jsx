import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Activity, Mail, Lock, Shield, Wrench, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import techImage from '../assets/tech_ac_repair.jpg';

const LoginPage = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        if (res.user.role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/technician/dashboard');
      } else {
        setError(res.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const quickLogins = [
    { label: 'Admin', email: 'admin@fieldflow.in', password: 'password', icon: Shield, color: '#0EA5E9' },
    { label: 'Technician', email: 'ramesh@fieldflow.in', password: 'password', icon: Wrench, color: '#10B981' },
  ];

  const features = [
    'Real-time job dispatch & tracking',
    'Multi-technician fleet management',
    'Inventory & parts management',
    'Digital invoicing & payments',
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-app)' }}>
      {/* ── LEFT HERO PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        {/* Background image */}
        <img
          src={techImage}
          alt="Field technician at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(10,20,40,0.85) 0%, rgba(15,23,42,0.6) 60%, rgba(6,182,212,0.15) 100%)'
        }} />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
              <Activity size={20} color="white" />
            </div>
            <span className="text-xl font-800 tracking-tight text-white">
              FIELD<span style={{ color: '#06B6D4' }}>FLOW</span>
            </span>
          </div>

          {/* Main headline */}
          <div className="mt-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-600 text-cyan-300">Field Service Management Platform</span>
            </div>

            <h1 className="text-4xl font-800 text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              Manage your entire<br />
              <span style={{ color: '#06B6D4' }}>field operations</span><br />
              from one place
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Dispatch technicians, track jobs in real-time, manage inventory, and collect payments — all in one powerful platform.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {features.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: '#06B6D4' }} className="shrink-0" />
                  <span className="text-sm text-slate-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
              <Activity size={18} color="white" />
            </div>
            <span className="text-lg font-800 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              FIELD<span className="gradient-text">FLOW</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-800 mb-1.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to access your FieldFlow workspace.{' '}
              <RouterLink to="/register" className="font-600" style={{ color: 'var(--primary)' }}>
                New? Register here
              </RouterLink>
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
              <span className="text-lg">⚠</span>
              <span className="font-500">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@fieldflow.com"
                  className="ff-input !pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ff-input !pl-10 !pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="ff-btn ff-btn-primary w-full py-3 text-base relative"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="ff-spinner" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Sign In
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          {/* Quick demo logins */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
              <span className="text-xs font-600" style={{ color: 'var(--text-muted)' }}>DEMO ACCOUNTS</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickLogins.map(q => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => { setEmail(q.email); setPassword(q.password); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background: 'var(--bg-surface-soft)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.background = `${q.color}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-surface-soft)'; }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${q.color}18` }}>
                      <Icon size={15} style={{ color: q.color }} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-700 truncate">{q.label}</p>
                      <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{q.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              Click a card to fill credentials, then Sign In
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
            <RouterLink to="/" style={{ color: 'var(--primary)' }}>← Back to home</RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
