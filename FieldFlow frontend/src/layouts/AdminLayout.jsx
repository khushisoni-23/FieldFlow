import React, { useState, useContext } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  Package,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Activity,
  CheckCircle,
  AlertTriangle,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { searchService } from '../services/searchService';
import Button from '../components/Button';

const AdminLayout = () => {
  const { 
    currentUser, 
    logout, 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    language, 
    setLanguage, 
    darkMode, 
    setDarkMode, 
    t,
    customers,
    technicians,
    jobs,
    inventory,
    payments,
    loading
  } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();
  
  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Global search states
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState({
    customers: [],
    technicians: [],
    jobs: [],
    inventory: [],
    payments: []
  });
  const [showGlobalResults, setShowGlobalResults] = useState(false);
  const [activeSelectionIndex, setActiveSelectionIndex] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = React.useRef(null);
  const notifRef = React.useRef(null);
  const searchContainerRef = React.useRef(null);

  // Close search results on click outside
  React.useEffect(() => {
    const clickOutsideSearch = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowGlobalResults(false);
      }
    };
    document.addEventListener('mousedown', clickOutsideSearch);
    return () => {
      document.removeEventListener('mousedown', clickOutsideSearch);
    };
  }, []);

  // Update results as query changes
  React.useEffect(() => {
    const performSearch = async () => {
      const results = await searchService.globalSearch(globalSearchQuery, {
        customers,
        technicians,
        jobs,
        inventory,
        payments
      });
      setGlobalSearchResults(results);
      setActiveSelectionIndex(-1); // Reset keyboard highlight
      setShowGlobalResults(!!globalSearchQuery.trim());
    };
    performSearch();
  }, [globalSearchQuery, customers, technicians, jobs, inventory, payments]);

  // Helper: flatten results to a simple list of clickable items
  const getFlattenedResults = () => {
    const list = [];
    if (globalSearchResults.customers.length > 0) {
      globalSearchResults.customers.forEach(item => {
        list.push({ type: 'CUSTOMER', label: item.name, sub: item.email || 'Customer', path: `/admin/customers/${item.id}`, original: item });
      });
    }
    if (globalSearchResults.technicians.length > 0) {
      globalSearchResults.technicians.forEach(item => {
        list.push({ type: 'TECHNICIAN', label: item.name, sub: item.specialization || 'Technician', path: `/admin/technicians`, original: item });
      });
    }
    if (globalSearchResults.jobs.length > 0) {
      globalSearchResults.jobs.forEach(item => {
        list.push({ type: 'JOB', label: item.id, sub: `${item.serviceType} - ${item.status}`, path: `/admin/jobs/${item.id}`, original: item });
      });
    }
    if (globalSearchResults.inventory.length > 0) {
      globalSearchResults.inventory.forEach(item => {
        list.push({ type: 'INVENTORY', label: item.partName, sub: `SKU: ${item.sku}`, path: `/admin/inventory`, original: item });
      });
    }
    if (globalSearchResults.payments.length > 0) {
      globalSearchResults.payments.forEach(item => {
        list.push({ type: 'PAYMENT', label: item.id, sub: `${item.customerName} - ₹${item.amount}`, path: `/admin/payments`, original: item });
      });
    }
    return list;
  };

  const flattenedResults = getFlattenedResults();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowGlobalResults(false);
      e.target.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showGlobalResults) {
        setShowGlobalResults(true);
        setActiveSelectionIndex(0);
      } else {
        setActiveSelectionIndex(prev => (prev < flattenedResults.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSelectionIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (showGlobalResults && flattenedResults.length > 0) {
        e.preventDefault();
        const index = activeSelectionIndex >= 0 ? activeSelectionIndex : 0;
        const target = flattenedResults[index];
        if (target) {
          navigate(target.path);
          setGlobalSearchQuery('');
          setShowGlobalResults(false);
          setMobileSearchOpen(false);
        }
      }
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'ADMIN') {
      navigate('/technician/dashboard');
    }
  }, [currentUser, navigate, loading]);

  // Disable body scroll when sidebar drawer is open on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'WORK',
      items: [
        { label: 'Customers', path: '/admin/customers', icon: Users },
        { label: 'Jobs', path: '/admin/jobs', icon: Briefcase },
        { label: 'Schedule', path: '/admin/jobs?view=schedule', icon: Calendar }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Technicians', path: '/admin/technicians', icon: UserCheck },
        { label: 'Inventory', path: '/admin/inventory', icon: Package },
        { label: 'Payments', path: '/admin/payments', icon: CreditCard }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Reports', path: '/admin/reports', icon: BarChart3 }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path.startsWith('/admin/jobs?view=schedule')) {
      return location.pathname === '/admin/jobs' && location.search.includes('view=schedule');
    }
    if (path === '/admin/jobs') {
      return location.pathname.startsWith('/admin/jobs') && !location.search.includes('view=schedule');
    }
    if (path === '/admin/customers') {
      return location.pathname.startsWith('/admin/customers');
    }
    return location.pathname === path;
  };

  const unreadNotifs = notifications.filter(n => !n.read);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--bg-app)' }}>
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
              <Activity size={20} color="white" />
            </div>
            <span className="text-xl font-800 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              FIELD<span className="gradient-text">FLOW</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm font-600" style={{ color: 'var(--text-secondary)' }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden font-sans text-sm text-[var(--text-primary)] w-full">
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] text-slate-300 flex flex-col transition-transform duration-300 transform shrink-0 h-full lg:h-screen
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
              <Activity size={16} color="white" />
            </div>
            <span className="text-base font-800 tracking-tight text-white">
              FIELD<span style={{ color: '#06B6D4' }}>FLOW</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer touch-target transition-colors"
            style={{ color: '#64748B', background: 'rgba(255,255,255,0.04)' }}
            aria-label="Close menu drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow py-5 px-3 space-y-5 overflow-y-auto text-left">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="text-[10px] font-700 tracking-widest uppercase px-3 mb-2" style={{ color: '#475569' }}>{group.title}</h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className="sidebar-nav-item"
                      style={active ? {
                        background: 'rgba(6,182,212,0.12)',
                        color: '#22D3EE',
                        fontWeight: '700',
                        borderLeft: '3px solid #06B6D4',
                        borderRadius: '0 10px 10px 0',
                        paddingLeft: '13px',
                      } : {}}
                    >
                      <Icon size={17} className="shrink-0" />
                      <span>{t(item.label.toLowerCase()) || item.label}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#06B6D4' }} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-nav-item w-full transition-all"
            style={{ width: '100%' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
          >
            <LogOut size={17} className="shrink-0" />
            {t('logout') || 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. MAIN LAYOUT AREA */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Header Navigation */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0" style={{ background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
          {/* Menu toggles & search */}
          <div className="flex items-center gap-4 flex-grow sm:flex-grow-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] rounded-lg cursor-pointer touch-target flex items-center justify-center transition-colors"
              aria-label="Open navigation menu drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Desktop Search Panel */}
            <div ref={searchContainerRef} className="hidden sm:flex items-center relative text-[var(--text-secondary)]">
              <Search className="w-4 h-4 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('searchPlaceholder') || "Search jobs, customers, technicians, parts..."}
                className="pl-9 pr-8 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-surface-soft)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs w-64 transition-all font-medium"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => { setGlobalSearchQuery(''); setShowGlobalResults(false); }}
                  className="absolute right-2.5 p-1 hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-surface-soft)] cursor-pointer flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Grouped results dropdown under desktop input */}
              {showGlobalResults && (
                <div className="absolute top-full left-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-y-auto max-h-[380px] z-50 p-2 text-left space-y-3 divide-y divide-[var(--border-color)]/30 backdrop-blur-xs w-[320px]">
                  {flattenedResults.length === 0 ? (
                    <div className="p-4 text-center text-[var(--text-secondary)] space-y-1">
                      <p className="font-bold text-xs">No results found</p>
                      <p className="text-[10px] opacity-75">Try searching for a customer, job, technician, or inventory item.</p>
                    </div>
                  ) : (
                    <>
                      {/* Customers Group */}
                      {globalSearchResults.customers.length > 0 && (
                        <div className="p-2 space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Customers</p>
                          {globalSearchResults.customers.map(item => {
                            const flatIdx = flattenedResults.findIndex(r => r.type === 'CUSTOMER' && r.original.id === item.id);
                            const isSelected = flatIdx === activeSelectionIndex;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigate(`/admin/customers/${item.id}`);
                                  setGlobalSearchQuery('');
                                  setShowGlobalResults(false);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                                  isSelected ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-semibold' : 'hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                                }`}
                              >
                                <span className="font-bold">{item.name}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">{item.email || item.phone}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Technicians Group */}
                      {globalSearchResults.technicians.length > 0 && (
                        <div className="p-2 pt-3 space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Technicians</p>
                          {globalSearchResults.technicians.map(item => {
                            const flatIdx = flattenedResults.findIndex(r => r.type === 'TECHNICIAN' && r.original.id === item.id);
                            const isSelected = flatIdx === activeSelectionIndex;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigate(`/admin/technicians`);
                                  setGlobalSearchQuery('');
                                  setShowGlobalResults(false);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                                  isSelected ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-semibold' : 'hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                                }`}
                              >
                                <span className="font-bold">{item.name}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">{item.specialization} • {item.phone}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Jobs Group */}
                      {globalSearchResults.jobs.length > 0 && (
                        <div className="p-2 pt-3 space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Jobs</p>
                          {globalSearchResults.jobs.map(item => {
                            const flatIdx = flattenedResults.findIndex(r => r.type === 'JOB' && r.original.id === item.id);
                            const isSelected = flatIdx === activeSelectionIndex;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigate(`/admin/jobs/${item.id}`);
                                  setGlobalSearchQuery('');
                                  setShowGlobalResults(false);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                                  isSelected ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-semibold' : 'hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                                }`}
                              >
                                <span className="font-bold text-[var(--primary)]">{item.id} - {item.serviceType}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">Client: {item.customerName} • Status: {item.status}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Inventory Group */}
                      {globalSearchResults.inventory.length > 0 && (
                        <div className="p-2 pt-3 space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Inventory</p>
                          {globalSearchResults.inventory.map(item => {
                            const flatIdx = flattenedResults.findIndex(r => r.type === 'INVENTORY' && r.original.id === item.id);
                            const isSelected = flatIdx === activeSelectionIndex;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigate(`/admin/inventory`);
                                  setGlobalSearchQuery('');
                                  setShowGlobalResults(false);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                                  isSelected ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-semibold' : 'hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                                }`}
                              >
                                <span className="font-bold">{item.partName}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">SKU: {item.sku} • Stock: {item.stock}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Payments Group */}
                      {globalSearchResults.payments.length > 0 && (
                        <div className="p-2 pt-3 space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Payments</p>
                          {globalSearchResults.payments.map(item => {
                            const flatIdx = flattenedResults.findIndex(r => r.type === 'PAYMENT' && r.original.id === item.id);
                            const isSelected = flatIdx === activeSelectionIndex;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigate(`/admin/payments`);
                                  setGlobalSearchQuery('');
                                  setShowGlobalResults(false);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                                  isSelected ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-semibold' : 'hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                                }`}
                              >
                                <span className="font-bold">{item.id}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">Client: {item.customerName} • ₹{item.amount} • {item.paymentMethod}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button Trigger */}
            <button
              onClick={() => { setMobileSearchOpen(true); setShowGlobalResults(false); }}
              className="sm:hidden p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
              aria-label="Open search overlay"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Action indicators & Profile */}
          <div className="flex items-center gap-3 relative">
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 border border-[var(--border-color)] rounded-lg p-0.5 bg-[var(--bg-surface-soft)]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  language === 'en' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  language === 'hi' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifDropdownOpen(!notifDropdownOpen); setProfileDropdownOpen(false); }}
                className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] rounded-lg relative cursor-pointer touch-target flex items-center justify-center"
                aria-label="View notifications center"
              >
                <Bell size={19} />
                {unreadNotifs.length > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  </>
                )}
              </button>

              {/* Notification drop menu */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col z-50 text-xs">
                  <div className="px-4 py-3 bg-[var(--bg-surface-soft)] border-b border-[var(--border-color)] flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)]">Notifications ({unreadNotifs.length})</span>
                    <button 
                      onClick={clearAllNotifications}
                      className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-bold hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border-color)]">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-[var(--text-secondary)]">No alerts logged.</p>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3 hover:bg-[var(--bg-surface-soft)]/50 transition-colors flex gap-2 cursor-pointer ${!n.read ? 'bg-[var(--soft-accent)]/20' : ''}`}
                          onClick={() => markNotificationAsRead(n.id)}
                        >
                          <div className="mt-0.5">
                            {n.title.includes('Stock') ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                          </div>
                          <div className="text-left">
                            <p className={`font-bold text-[var(--text-primary)] ${!n.read ? 'text-[var(--text-primary)] font-black' : ''}`}>{n.title}</p>
                            <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">{n.message}</p>
                            <p className="text-[var(--text-secondary)] opacity-70 text-[9px] mt-1">{new Date(n.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative font-sans" ref={profileRef}>
              <button
                onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotifDropdownOpen(false); }}
                className="flex items-center gap-2 p-1.5 hover:bg-[var(--bg-surface-soft)] rounded-lg cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-800 text-sm text-white shadow-sm shrink-0" style={{ background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[var(--text-primary)]">{currentUser?.name || 'Admin'}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-tight">{t('roleAdmin') || 'Administrator'}</p>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col z-50 text-xs text-left">
                  <div className="p-3 border-b border-[var(--border-color)]">
                    <p className="font-bold text-[var(--text-primary)]">{currentUser.name}</p>
                    <p className="text-[var(--text-secondary)] mt-0.5">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileDropdownOpen(false); navigate('/admin/settings'); }}
                    className="p-3 text-left hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)] font-bold flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    {t('settings') || 'Settings'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-3 text-left hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 font-bold flex items-center gap-2 border-t border-[var(--border-color)] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t('logout') || 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Panel Content Area */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-7">
          <div className="page-transition">
          <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Search Overlay Panel */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-card)] flex flex-col font-sans">
          {/* Mobile Overlay Header */}
          <div className="h-16 border-b border-[var(--border-color)] flex items-center px-4 gap-3 shrink-0">
            <button
              onClick={() => { setMobileSearchOpen(false); setGlobalSearchQuery(''); }}
              className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] rounded-lg cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Close search overlay"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative flex-grow flex items-center text-[var(--text-secondary)]">
              <Search className="w-4.5 h-4.5 absolute left-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('searchPlaceholder') || "Search jobs, customers, technicians, parts..."}
                className="pl-10 pr-10 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-sm w-full font-medium"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => { setGlobalSearchQuery(''); }}
                  className="absolute right-3 p-1 hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-surface-soft)] cursor-pointer flex items-center justify-center"
                  aria-label="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Overlay Results Dropdown Area */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col space-y-4 text-left divide-y divide-[var(--border-color)]/30 bg-[var(--bg-card)]">
            {flattenedResults.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] space-y-1">
                <p className="font-bold text-sm">No results found</p>
                <p className="text-xs opacity-75">Try searching for a customer, job, technician, or inventory item.</p>
              </div>
            ) : (
              <>
                {/* Customers Group */}
                {globalSearchResults.customers.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Customers</p>
                    {globalSearchResults.customers.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(`/admin/customers/${item.id}`);
                          setGlobalSearchQuery('');
                          setShowGlobalResults(false);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-lg text-sm hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)] transition-colors flex flex-col cursor-pointer"
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{item.email || item.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Technicians Group */}
                {globalSearchResults.technicians.length > 0 && (
                  <div className="p-2 pt-3 space-y-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Technicians</p>
                    {globalSearchResults.technicians.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(`/admin/technicians`);
                          setGlobalSearchQuery('');
                          setShowGlobalResults(false);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-lg text-sm hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)] transition-colors flex flex-col cursor-pointer"
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{item.specialization} • {item.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Jobs Group */}
                {globalSearchResults.jobs.length > 0 && (
                  <div className="p-2 pt-3 space-y-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Jobs</p>
                    {globalSearchResults.jobs.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(`/admin/jobs/${item.id}`);
                          setGlobalSearchQuery('');
                          setShowGlobalResults(false);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-lg text-sm hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)] transition-colors flex flex-col cursor-pointer"
                      >
                        <span className="font-bold text-[var(--primary)]">{item.id} - {item.serviceType}</span>
                        <span className="text-xs text-[var(--text-secondary)]">Client: {item.customerName} • Status: {item.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Inventory Group */}
                {globalSearchResults.inventory.length > 0 && (
                  <div className="p-2 pt-3 space-y-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Inventory</p>
                    {globalSearchResults.inventory.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(`/admin/inventory`);
                          setGlobalSearchQuery('');
                          setShowGlobalResults(false);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-lg text-sm hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)] transition-colors flex flex-col cursor-pointer"
                      >
                        <span className="font-bold">{item.partName}</span>
                        <span className="text-xs text-[var(--text-secondary)]">SKU: {item.sku} • Stock: {item.stock}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Payments Group */}
                {globalSearchResults.payments.length > 0 && (
                  <div className="p-2 pt-3 space-y-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Payments</p>
                    {globalSearchResults.payments.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(`/admin/payments`);
                          setGlobalSearchQuery('');
                          setShowGlobalResults(false);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-lg text-sm hover:bg-[var(--bg-surface-soft)] text-[var(--text-primary)] transition-colors flex flex-col cursor-pointer"
                      >
                        <span className="font-bold">{item.id}</span>
                        <span className="text-xs text-[var(--text-secondary)]">Client: {item.customerName} • ₹{item.amount} • {item.paymentMethod}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
