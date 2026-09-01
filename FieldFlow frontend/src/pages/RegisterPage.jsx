import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Activity, User, Mail, Phone, Lock, Eye, EyeOff, Shield, Wrench, ArrowRight, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import techImage from '../assets/tech_electrician.jpg';

const SPECIALIZATIONS = ['AC Repair', 'Electrical', 'Plumbing', 'Appliance Repair', 'Carpentry', 'General Maintenance'];

const RegisterPage = () => {
  const { registerUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'ADMIN', specialization: 'AC Repair',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await registerUser({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, role: form.role,
        specialization: form.role === 'TECHNICIAN' ? form.specialization : undefined,
      });
      setLoading(false);
      if (res.success) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1800);
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-app)' }}>

      {/* ── LEFT HERO ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col">
        <img src={techImage} alt="Electrical technician" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(10,20,40,0.88) 0%, rgba(15,23,42,0.65) 60%, rgba(6,182,212,0.12) 100%)'
        }} />
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
              <Activity size={20} color="white" />
            </div>
            <span className="text-xl font-800 tracking-tight text-white">
              FIELD<span style={{ color: '#06B6D4' }}>FLOW</span>
            </span>
          </div>

          <div className="mt-auto mb-12">
            <h1 className="text-4xl font-800 text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              Join thousands of<br />
              <span style={{ color: '#06B6D4' }}>field professionals</span><br />
              who use FieldFlow
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md mb-8">
              Set up your workspace in minutes. No credit card required.
            </p>
            {['Free 30-day trial', 'All features included', 'Cancel anytime'].map(f => (
              <div key={f} className="flex items-center gap-3 mb-3">
                <CheckCircle size={16} style={{ color: '#06B6D4' }} className="shrink-0" />
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="flex-1 flex items-start justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
              <Activity size={18} color="white" />
            </div>
            <span className="text-lg font-800 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              FIELD<span className="gradient-text">FLOW</span>
            </span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-800 mb-1.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Create your account
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <RouterLink to="/login" className="font-600" style={{ color: 'var(--primary)' }}>Sign in here</RouterLink>
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { val: 'ADMIN', label: 'Admin / Manager', sub: 'Manage the full platform', Icon: Shield, color: '#0EA5E9' },
              { val: 'TECHNICIAN', label: 'Technician', sub: 'Access field job portal', Icon: Wrench, color: '#10B981' },
            ].map(({ val, label, sub, Icon, color }) => {
              const active = form.role === val;
              return (
                <button
                  key={val} type="button"
                  onClick={() => setForm(f => ({ ...f, role: val }))}
                  className="flex flex-col items-start p-4 rounded-xl text-left cursor-pointer transition-all"
                  style={{
                    background: active ? `${color}12` : 'var(--bg-surface-soft)',
                    border: `1.5px solid ${active ? color : 'var(--border-color)'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={15} style={{ color: active ? color : 'var(--text-muted)' }} />
                    <span className="text-xs font-700" style={{ color: active ? color : 'var(--text-primary)' }}>{label}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                </button>
              );
            })}
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
              ⚠ <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm" style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)' }}>
              <CheckCircle size={16} /> <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name *</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input type="text" required value={form.name} onChange={set('name')} placeholder="Your full name" className="ff-input !pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>Email Address *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" className="ff-input !pl-10" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className="ff-input !pl-10" />
              </div>
            </div>

            {/* Specialization (technician only) */}
            {form.role === 'TECHNICIAN' && (
              <div>
                <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>Specialization *</label>
                <select value={form.specialization} onChange={set('specialization')} className="ff-select">
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Min. 6 characters" className="ff-input !pl-10 !pr-10" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-600 mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirm Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" className="ff-input !pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="ff-btn ff-btn-primary w-full py-3 text-base mt-2">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="ff-spinner" />Creating account...</span>
                : <span className="flex items-center justify-center gap-2">Create Account <ArrowRight size={18} /></span>
              }
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            <RouterLink to="/" style={{ color: 'var(--primary)' }}>← Back to home</RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
