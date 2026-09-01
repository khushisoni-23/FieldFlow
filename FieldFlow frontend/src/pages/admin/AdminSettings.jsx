import React, { useContext, useState } from 'react';
import { Settings, User, Bell, Globe, Sun, ShieldAlert, Check } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const AdminSettings = () => {
  const { 
    settings, 
    updateSettings, 
    language, 
    setLanguage, 
    darkMode, 
    setDarkMode, 
    t 
  } = useContext(AppContext);

  // Active section tab
  const [activeTab, setActiveTab] = useState('profile');

  // Business Form State
  const [businessName, setBusinessName] = useState(settings.businessName || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address || '');
  const [taxId, setTaxId] = useState(settings.taxId || '');

  // Notifications Form State
  const [notifNewJob, setNotifNewJob] = useState(settings.notifNewJob ?? true);
  const [notifStock, setNotifStock] = useState(settings.notifStock ?? true);
  const [notifPayment, setNotifPayment] = useState(settings.notifPayment ?? true);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings({
      businessName,
      phone,
      email,
      address,
      taxId
    });
    triggerSuccess();
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    updateSettings({
      notifNewJob,
      notifStock,
      notifPayment
    });
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: User },
    { id: 'appearance', label: 'Appearance Theme', icon: Sun },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Header */}
      <div>
        <h1 className="heading-main text-[var(--text-primary)]">{t('settingsPage') || 'System Settings'}</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Configure company profiles, notification alerts, language parameters and default appearance details.</p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-[#16805B]/20 rounded-lg text-xs text-[#16805B] font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        
        {/* Left Side Tab Links */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border-color)] bg-[var(--bg-surface-soft)]/20 shrink-0 py-4">
          <nav className="space-y-1 px-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-[var(--soft-accent)] text-[var(--primary)] border-l-4 border-[var(--primary)] rounded-l-none'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Side Form Content */}
        <main className="flex-grow p-6">
          
          {/* Tab 1: Profile Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
              <h3 className="font-extrabold text-sm border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">Company Business Profile</h3>
              
              <Input
                label="Registered Business Name"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="FieldFlow Solutions"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Office Phone Number"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Operations Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ops@fieldflow.in"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Business Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-lg border border-[var(--border-color)] text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <Input
                label="GSTIN Tax Identification ID (GSTIN / VAT)"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. 27AAAAA0000A1Z1"
              />

              <Button type="submit" variant="primary">
                Save Profile settings
              </Button>
            </form>
          )}

          {/* Tab 2: Appearance Toggle */}
          {activeTab === 'appearance' && (
            <div className="space-y-5 max-w-lg">
              <h3 className="font-extrabold text-sm border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">Interface Appearance</h3>
              <p className="text-xs text-[var(--text-secondary)]">Adjust your visual interface theme preferences dynamically.</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`
                    flex-1 flex flex-col items-center justify-center p-6 border rounded-xl gap-3 transition-all cursor-pointer
                    ${!darkMode 
                      ? 'border-[var(--primary)] bg-[var(--soft-accent)] text-[var(--primary)] font-bold' 
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface-soft)]'
                    }
                  `}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-xs">Light Theme (Default)</span>
                </button>

                <button
                  onClick={() => setDarkMode(true)}
                  className={`
                    flex-1 flex flex-col items-center justify-center p-6 border rounded-xl gap-3 transition-all cursor-pointer
                    ${darkMode 
                      ? 'border-[var(--primary)] bg-emerald-950/20 text-[var(--primary)] font-bold' 
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface-soft)]'
                    }
                  `}
                >
                  <Sun className="w-6 h-6 rotate-180" />
                  <span className="text-xs">Dark Theme</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Language Settings */}
          {activeTab === 'language' && (
            <div className="space-y-5 max-w-lg">
              <h3 className="font-extrabold text-sm border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">Application Language</h3>
              <p className="text-xs text-[var(--text-secondary)]">Select the interface translation context.</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`
                    flex items-center justify-between p-4 border rounded-xl transition-all text-left cursor-pointer
                    ${language === 'en' 
                      ? 'border-[var(--primary)] bg-[var(--soft-accent)] text-[var(--primary)] font-bold' 
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface-soft)]'
                    }
                  `}
                >
                  <span className="text-xs">English (Default US/UK)</span>
                  {language === 'en' && <Check className="w-4 h-4 text-[var(--primary)]" />}
                </button>

                <button
                  onClick={() => setLanguage('hi')}
                  className={`
                    flex items-center justify-between p-4 border rounded-xl transition-all text-left cursor-pointer
                    ${language === 'hi' 
                      ? 'border-[var(--primary)] bg-[var(--soft-accent)] text-[var(--primary)] font-bold' 
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface-soft)]'
                    }
                  `}
                >
                  <span className="text-xs">हिन्दी (Hindi Context)</span>
                  {language === 'hi' && <Check className="w-4 h-4 text-[var(--primary)]" />}
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Notifications Toggle */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6 max-w-lg">
              <h3 className="font-extrabold text-sm border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">Operational Alert Preferences</h3>
              <p className="text-xs text-[var(--text-secondary)]">Declare when you would like to receive notifications and email triggers.</p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={notifNewJob}
                    onChange={(e) => setNotifNewJob(e.target.checked)}
                    className="rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] w-4 h-4 cursor-pointer"
                  />
                  <span>Dispatch Alerts: Notify dispatcher on technician job status changes</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={notifStock}
                    onChange={(e) => setNotifStock(e.target.checked)}
                    className="rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] w-4 h-4 cursor-pointer"
                  />
                  <span>Low Stock Warnings: Notify store rooms when spare components are critical</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={notifPayment}
                    onChange={(e) => setNotifPayment(e.target.checked)}
                    className="rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] w-4 h-4 cursor-pointer"
                  />
                  <span>Ledger Logs: Show alert popups when customer payments are logged</span>
                </label>
              </div>

              <Button type="submit" variant="primary">
                Save alert configurations
              </Button>
            </form>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
