import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Activity, Globe, Sun, Moon } from 'lucide-react';
import Button from '../components/Button';
import { AppContext } from '../context/AppContext';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, darkMode, setDarkMode, t } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: t('features') || 'FEATURES', path: '/features' },
    { label: t('howItWorks') || 'HOW IT WORKS', path: '/how-it-works' },
    { label: t('solutions') || 'SOLUTIONS', path: '/solutions' }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
              <div className="p-1.5 bg-[var(--primary)] rounded-lg text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                FIELD<span className="text-[var(--primary)] font-extrabold">FLOW</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1.5 text-[16px] font-semibold transition-all duration-200 cursor-pointer group
                      ${active 
                        ? 'text-[var(--primary)]' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    {link.label}
                    {/* Active/Hover underline slide indicator */}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] transition-all duration-200
                      ${active ? 'w-full' : 'w-0 group-hover:w-full'}
                    `} />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 border border-[var(--border-color)] rounded-lg p-0.5 bg-[var(--bg-surface-soft)]">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    language === 'hi' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] rounded-lg transition-colors cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                {t('login') || 'Login'}
              </Link>
              <Button size="sm" onClick={() => navigate('/register')} variant="primary">
                {t('getStarted') || 'Get Started'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] rounded-lg"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-surface-soft)]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-card)] py-4 px-4 shadow-lg transition-all">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`text-base font-semibold py-2 px-3 rounded-lg hover:bg-[var(--bg-surface-soft)] transition-colors ${
                    isActive(link.path) ? 'text-[var(--primary)] bg-[var(--soft-accent)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-[var(--border-color)] my-1" />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Language</span>
                <div className="flex items-center gap-1 border border-[var(--border-color)] rounded-lg p-0.5 bg-[var(--bg-surface-soft)]">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                      language === 'en' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                      language === 'hi' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 pt-1">
                <Link to="/login" onClick={handleLinkClick} className="text-base font-semibold text-[var(--text-secondary)]">
                  {t('login') || 'Login'}
                </Link>
                <Button size="sm" onClick={() => { handleLinkClick(); navigate('/register'); }} variant="primary">
                  {t('getStarted') || 'Get Started'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Marketing Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-sidebar)] border-t border-[var(--border-color)] text-[var(--text-secondary)] dark:text-[#A8B0A3] py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--primary)] rounded-lg text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  FIELD<span className="text-[var(--accent)] font-extrabold">FLOW</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed opacity-85 text-gray-300">
                "{t('tagline') || 'Every Service Job. Under Control.'}"<br />
                {t('supportingText') || 'Manage customers, assign technicians, track service work, parts and payments — all from one workspace.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-2 text-sm font-medium">
                <li><Link to="/features" className="hover:text-white transition-colors">{t('features')}</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">{t('howItWorks')}</Link></li>
                <li><Link to="/solutions" className="hover:text-white transition-colors">{t('solutions')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Solutions</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/solutions" state={{ scrollTo: 'AC & Appliance Repair' }} className="hover:text-white transition-colors">AC & Appliance Repair</Link></li>
                <li><Link to="/solutions" state={{ scrollTo: 'RO / Water Purifier Service' }} className="hover:text-white transition-colors">Water Purifier & RO</Link></li>
                <li><Link to="/solutions" state={{ scrollTo: 'Electrician Businesses' }} className="hover:text-white transition-colors">Electrical Businesses</Link></li>
                <li><Link to="/solutions" state={{ scrollTo: 'Plumbing Services' }} className="hover:text-white transition-colors">Plumbing Services</Link></li>
                <li><Link to="/solutions" state={{ scrollTo: 'CCTV Installation & Maintenance' }} className="hover:text-white transition-colors">CCTV Installation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a 
                    href="#coming-soon" 
                    onClick={(e) => { e.preventDefault(); alert('Help Center documentation will be available post-release.'); }} 
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a 
                    href="#coming-soon" 
                    onClick={(e) => { e.preventDefault(); alert('Product documentation is currently under development.'); }} 
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="#coming-soon" 
                    onClick={(e) => { e.preventDefault(); alert('Privacy policy statement is available in physical contracts.'); }} 
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="pt-2">
                  <div className="flex items-center gap-1 border border-slate-700 rounded-lg p-0.5 bg-slate-800 w-fit">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        language === 'en' ? 'bg-[var(--primary)] text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('hi')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        language === 'hi' ? 'bg-[var(--primary)] text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-center opacity-70">
            <p>&copy; {new Date().getFullYear()} FieldFlow. All rights reserved. Professional Operations SaaS for Field Service Teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
