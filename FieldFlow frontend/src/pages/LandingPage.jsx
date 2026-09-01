import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  UserCheck,
  Wrench,
  Package,
  CreditCard,
  BarChart3,
  History,
  Phone,
  MessageSquare,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Star,
  Check,
  Tv,
  Camera,
  Play
} from 'lucide-react';
import Button from '../components/Button';
import { AppContext } from '../context/AppContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useContext(AppContext);

  const problemIcons = [
    { name: t('phoneCalls') || 'Phone Calls', icon: Phone, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { name: t('whatsappChats') || 'WhatsApp Chats', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: t('paperNotebooks') || 'Paper Notebooks', icon: BookOpen, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20' },
    { name: t('excelSpreadsheets') || 'Excel & Notebooks', icon: FileSpreadsheet, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' }
  ];

  const workflowSteps = [
    { label: t('step1') || 'Customer Request', desc: t('step1Desc') || 'Call or booking registered' },
    { label: t('step2') || 'Create Job', desc: t('step2Desc') || 'Set service & priority' },
    { label: t('step3') || 'Assign Technician', desc: t('step3Desc') || 'Allocate job card' },
    { label: t('step4') || 'Technician Travels', desc: t('step4Desc') || 'Real-time on the way' },
    { label: t('step5') || 'Service Execution', desc: t('step5Desc') || 'Diagnostic & fix' },
    { label: t('step6') || 'Parts & Photos', desc: t('step6Desc') || 'Track components' },
    { label: t('step7') || 'Complete Job', desc: t('step7Desc') || 'Technician sign-off' },
    { label: t('step8') || 'Payment Collected', desc: t('step8Desc') || 'UPI or cash logged' },
    { label: t('step9') || 'Service History', desc: t('step9Desc') || 'Saved chronologically' }
  ];

  const targets = [
    { name: t('targetAC') || 'AC & Appliance Repair', icon: '❄️', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80', desc: t('targetACDesc') || 'Manage leakages, gas fills, seasonal services.' },
    { name: t('targetRO') || 'RO & Water Purifier', icon: '💧', img: 'https://images.unsplash.com/photo-1624696157798-3e2b8a7bc1a1?auto=format&fit=crop&w=400&q=80', desc: t('targetRODesc') || 'Track cartridge replacements, TDS logs.' },
    { name: t('targetElectric') || 'Electricians', icon: '⚡', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80', desc: t('targetElectricDesc') || 'Assign wiring setups, DB boards, repairs.' },
    { name: t('targetPlumber') || 'Plumbers', icon: '🔧', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80', desc: t('targetPlumberDesc') || 'Manage pipeline fittings, leaks, pumps.' },
    { name: t('targetCCTV') || 'CCTV Installation', icon: '📹', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80', desc: t('targetCCTVDesc') || 'Track site visits, camera mapping, wiring.' },
    { name: t('targetMaint') || 'General Maintenance', icon: '🛠️', img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=400&q=80', desc: t('targetMaintDesc') || 'Periodic facility visits, carpentry, checks.' }
  ];

  return (
    <div className="relative overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-gradient-to-b from-[var(--bg-surface-soft)]/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--soft-accent)] text-[var(--primary)] border border-[var(--accent)]/20 shadow-2xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t('heroBadge') || 'SaaS Operations Management Platform'}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[var(--text-primary)]">
                {t('tagline') || 'Every Service Job.'} <br />
                <span className="text-[var(--primary)]">{t('underControl') || 'Under Control.'}</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-xl leading-relaxed">
                {t('supportingText') || 'Manage customers, assign technicians, track service work, parts and payments — all from one workspace.'}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" onClick={() => navigate('/register')} variant="primary">
                  {t('registerCTA') || 'Get Started Now'}
                </Button>
                <Button size="lg" onClick={() => navigate('/how-it-works')} variant="outline">
                  {t('howItWorksCTA') || 'See How It Works'}
                </Button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-[var(--border-color)] flex items-center gap-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-[var(--bg-card)] flex items-center justify-center font-bold text-[10px] text-white">R</div>
                  <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-[var(--bg-card)] flex items-center justify-center font-bold text-[10px] text-white">S</div>
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] border-2 border-[var(--bg-card)] flex items-center justify-center font-bold text-[10px] text-white">A</div>
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1 font-bold text-[var(--text-primary)]">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>4.9 / 5 operational rating</span>
                  </div>
                  <p>{t('trustRatingText') || 'Trusted by local maintenance and repair workshops'}</p>
                </div>
              </div>
            </div>

            {/* Right Dashboard Product Preview Mockup */}
            <div className="lg:col-span-6 relative">
              {/* Background Blob decoration */}
              <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[var(--soft-accent)]/45 blur-2xl -z-10" />
              
              <div className="relative bg-[var(--bg-sidebar)] rounded-xl shadow-2xl border border-slate-800 overflow-hidden text-white font-sans text-xs">
                {/* Simulated Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-400 font-bold ml-2">FieldFlow Operations Dashboard</span>
                  </div>
                  <span className="bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                    Live Status
                  </span>
                </div>

                {/* Simulated Metrics Bar */}
                <div className="p-4 grid grid-cols-4 gap-2 bg-slate-900/60 border-b border-slate-800">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/50">
                    <p className="text-slate-400 uppercase font-semibold tracking-wider text-[8px]">{t('todaysJobs') || "Today's Jobs"}</p>
                    <p className="text-base font-black text-white mt-0.5">18</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/50">
                    <p className="text-emerald-400 uppercase font-semibold tracking-wider text-[8px]">{t('completed') || "Completed"}</p>
                    <p className="text-base font-black text-emerald-400 mt-0.5">10</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/50">
                    <p className="text-blue-400 uppercase font-semibold tracking-wider text-[8px]">{t('inProgress') || "In Progress"}</p>
                    <p className="text-base font-black text-blue-400 mt-0.5">4</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/50">
                    <p className="text-amber-400 uppercase font-semibold tracking-wider text-[8px]">{t('pending') || "Pending"}</p>
                    <p className="text-base font-black text-amber-400 mt-0.5">4</p>
                  </div>
                </div>

                {/* Financial Summary card floating indicator */}
                <div className="p-4 grid grid-cols-2 gap-4 bg-slate-900/40 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-900/50 rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[9px] uppercase tracking-wider">{t('collectedRevenue') || 'Revenue Collected'}</p>
                      <p className="text-sm font-extrabold text-white">₹82,500</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-950/80 text-amber-400 border border-amber-900/50 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[9px] uppercase tracking-wider">{t('pendingCollection') || 'Outstanding Dues'}</p>
                      <p className="text-sm font-extrabold text-white">₹24,300</p>
                    </div>
                  </div>
                </div>

                {/* Recent job logs */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Active Operations Log</p>
                    <span className="text-[9px] text-[var(--accent)] font-semibold">4 Technicians Active</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                      <div>
                        <span className="font-bold text-white block">F-1021 — AC Leakage Repair</span>
                        <span className="text-[9px] text-slate-400">Cust: Rahul Sharma | Tech: Ramesh Prasad</span>
                      </div>
                      <span className="bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded border border-blue-800/30 text-[9px] font-semibold">
                        On The Way
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                      <div>
                        <span className="font-bold text-white block">F-1023 — RO Purifier Filter Service</span>
                        <span className="text-[9px] text-slate-400">Cust: Neha Gupta | Tech: Suresh Patil</span>
                      </div>
                      <span className="bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/30 text-[9px] font-semibold">
                        Arrived & Repairing
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating KPI Cards decoration */}
              <div className="absolute -bottom-6 -left-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg p-3 flex items-center gap-3 animate-bounce-slow">
                <div className="p-2 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">Fleet Status</p>
                  <p className="text-xs font-extrabold text-[var(--text-primary)]">4 Active Staff</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL STATS */}
      <section className="py-10 bg-[var(--bg-card)] border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="py-4 md:py-0">
              <p className="text-3xl font-black text-[var(--primary)]">15,000+</p>
              <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">{t('statJobs') || 'Jobs Tracked'}</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-3xl font-black text-[var(--primary)]">120+</p>
              <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">{t('statCities') || 'Local Service Businesses'}</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-3xl font-black text-[var(--primary)]">6+</p>
              <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">{t('statCategories') || 'Service Sectors'}</p>
            </div>
            <div className="py-4 md:py-0">
              <p className="text-3xl font-black text-[var(--primary)]">99.8%</p>
              <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">{t('statAccuracy') || 'Payment Tracking Success'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {t('problemHeader') || 'Still managing service operations across calls, WhatsApp and notebooks?'}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto leading-relaxed">
              {t('problemSub') || 'Running a service fleet on fragmented notebooks causes missed client details, technician dispatch delays, leakage in spares inventory, and delayed payments.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {problemIcons.map((prob) => {
              const Icon = prob.icon;
              return (
                <div key={prob.name} className="flex flex-col items-center p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:shadow-md transition-all duration-200">
                  <div className={`p-3 rounded-lg ${prob.color} mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{prob.name}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-[var(--soft-accent)] text-[var(--primary)] px-6 py-3 rounded-lg border border-[var(--accent)]/20 font-bold text-sm shadow-xs">
              ✨ FieldFlow brings dispatch, inventory, execution and payments into one workspace.
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICE CATEGORIES */}
      <section className="py-16 md:py-24 bg-[var(--bg-card)] border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {t('categoriesTitle') || 'Tailored for local service businesses'}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
              {t('categoriesSub') || 'Specialized operational templates created for key service sectors.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {targets.map((tgt) => (
              <div 
                key={tgt.name} 
                onClick={() => navigate('/solutions', { state: { scrollTo: tgt.name } })}
                className="glow-card group bg-[var(--bg-app)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={tgt.img} 
                    alt={tgt.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, var(--bg-surface-soft), var(--bg-card))';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-3xl">{tgt.icon}</span>
                </div>
                <div className="p-6 text-left space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {tgt.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                      {tgt.desc}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-xs font-bold text-[var(--primary)] group-hover:translate-x-1 transition-transform duration-200 mt-auto">
                    <span>Explore Solutions</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW PIPELINE MAP */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {t('workflowTitle') || 'Operational execution tracking pipeline'}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
              {t('workflowSub') || 'Keep dispatchers, technicians, and customers on the same page from request to payment.'}
            </p>
          </div>

          {/* Interactive timeline progress animation map */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-4 text-center">
            {workflowSteps.map((step, index) => (
              <div 
                key={step.label} 
                className="relative group flex flex-col items-center bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-2xs hover:border-[var(--primary)]/60 transition-all duration-200"
              >
                {/* Circle counter */}
                <div className="w-8 h-8 rounded-full bg-[var(--bg-surface-soft)] text-[var(--primary)] text-xs flex items-center justify-center font-bold mb-3 border border-[var(--border-color)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{step.label}</h4>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 leading-snug">{step.desc}</p>
                
                {/* Connector arrows on wide viewports */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-[var(--border-color)] z-10">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRODUCT FEATURE SECTIONS (Alternating Layout) */}
      <section className="py-16 md:py-24 bg-[var(--bg-card)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Alternating 1: Customer & Spares */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="p-2.5 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg w-fit">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {t('feature1Title') || 'Unified customer profiles & historic service jobs ledger'}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Onboard customers and save billing profiles, location details, and service logs chronologically. Access technician notes, photographs, invoices, and spare parts logs mapped to past jobs in a single search click.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-[var(--text-primary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16805B]" /> Chronological service logs per client account
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16805B]" /> Detailed technician feedback and diagnostic logs
                </li>
              </ul>
            </div>
            {/* Mock layout representing detail list */}
            <div className="bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl p-5 shadow-inner">
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
                  <div>
                    <h5 className="font-bold text-[var(--text-primary)]">Ramesh Chandra</h5>
                    <span className="text-[10px] text-[var(--text-secondary)]">+91 98920 11022 | Vashi, Navi Mumbai</span>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] px-2 py-0.5 rounded-full border border-emerald-100/50 font-bold uppercase text-[8px]">
                    Active Account
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-[var(--text-secondary)] text-[10px] uppercase">Service History Logs</p>
                  <div className="pl-3 border-l-2 border-[var(--primary)] space-y-2">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Job F-1209 — RO Cartridge Replacement</p>
                      <span className="text-[10px] text-[var(--text-secondary)]">Completed on Aug 21, 2026 | Tech: Amit Kumar</span>
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Job F-1102 — AC Wet Clean Service</p>
                      <span className="text-[10px] text-[var(--text-secondary)]">Completed on Jun 12, 2026 | Tech: Ramesh Prasad</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternating 2: Dispatch and Technician Workload (Reversed Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-6 text-left">
              <div className="p-2.5 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg w-fit">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {t('feature2Title') || 'Operational scheduling, routing & technician fleet dispatching'}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Log service requests, prioritize them, and dispatch technicians. Monitor technician statuses dynamically (Available, On Job, Offline) to prevent overbookings and double allocations.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-[var(--text-primary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16805B]" /> Real-time status changes: On The Way, Arrived, In Progress
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16805B]" /> Prevent calendar overlap for technician schedules
                </li>
              </ul>
            </div>
            {/* Mock Layout */}
            <div className="lg:order-1 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl p-5 shadow-inner">
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
                  <span className="font-bold text-[var(--text-primary)]">Active Technician Workload</span>
                  <span className="text-xs text-[var(--primary)] font-bold">Ramesh Prasad (AC Specialist)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-surface-soft)]">
                    <span className="block text-[8px] text-[var(--text-secondary)] uppercase">Completed Today</span>
                    <span className="text-sm font-bold text-[#16805B]">3 Jobs</span>
                  </div>
                  <div className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-surface-soft)]">
                    <span className="block text-[8px] text-[var(--text-secondary)] uppercase">Active Job</span>
                    <span className="text-sm font-bold text-blue-500">1 Job</span>
                  </div>
                  <div className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-surface-soft)]">
                    <span className="block text-[8px] text-[var(--text-secondary)] uppercase">Feedback Rating</span>
                    <span className="text-sm font-bold text-amber-500">4.9 Star</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternating 3: Inventory Control and Payments (Standard Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="p-2.5 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg w-fit">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {t('feature3Title') || 'Real-time spare parts stock inventory & billing integration'}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Connect jobs with stock rooms. When technicians log repairs with spare components, FieldFlow automatically deducts stock levels and sends low stock alarms to prevent project halts.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-[var(--text-primary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16805B]" /> Automated SKU tracking with warning parameters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16805B]" /> Cash & digital UPI payments ledger dashboard
                </li>
              </ul>
            </div>
            {/* Mock Layout */}
            <div className="bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl p-5 shadow-inner">
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
                  <span className="font-bold text-[var(--text-primary)]">Inventory Alarm</span>
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 rounded px-1.5 py-0.5 font-bold uppercase">Critical</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">RO Membrane Filter 75GPD</span>
                    <span className="text-[9px] text-[var(--text-secondary)]">SKU: RO-MEM-75</span>
                  </div>
                  <span className="font-bold text-red-600">1 Item Remaining</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. TECHNICIAN APP EXPERIENCE MOBILE SIMULATOR */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-[var(--bg-surface-soft)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Simulator Details */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--soft-accent)] text-[var(--primary)] border border-[var(--accent)]/20">
                Action-Oriented Mobile Portal
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {t('techAppTitle') || 'Empower field technicians with an interactive mobile checklist workspace'}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Technicians get a simplified touch-first screen on site. No complex inputs: just toggle status updates (On The Way → Arrived → Complete Service), upload before/after photos, select spare parts used from current inventory, and log billing records.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[var(--text-primary)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                  <span>One-click caller dials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                  <span>Spares billing dropdowns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                  <span>Interactive status buttons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                  <span>Camera logs comparison</span>
                </div>
              </div>
            </div>

            {/* Mobile simulator mock */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-[280px] h-[520px] rounded-[36px] bg-slate-900 border-[8px] border-slate-950 shadow-2xl relative overflow-hidden flex flex-col text-white font-sans text-xs">
                {/* Speaker indicator decoration */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                  <div className="w-6 h-1 bg-slate-800 rounded-full" />
                </div>
                
                {/* Screen Header */}
                <div className="bg-slate-950 pt-7 pb-3 px-4 flex justify-between items-center border-b border-slate-800">
                  <span className="font-bold">FieldFlow Tech Portal</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                {/* Simulated Screen Content */}
                <div className="p-3 space-y-3 flex-grow overflow-y-auto bg-slate-900">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[var(--primary)] font-bold">TODAY'S JOB #F-1021</span>
                      <span className="bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold">In Progress</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-xs">Rahul Sharma</p>
                      <p className="text-[9px] text-slate-400">AC Wet Cleaning Service</p>
                      <p className="text-[9px] text-slate-400">Sector 15, Vashi, Navi Mumbai</p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-1.5">
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded text-[10px] border border-slate-700">
                      📞 Call Customer (+91 98201...)
                    </button>
                    <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-slate-950 font-bold py-2 rounded text-[10px]">
                      🚗 Mark as Arrived at Site
                    </button>
                  </div>

                  {/* Photos segment */}
                  <div className="border border-slate-800 p-2.5 rounded-lg space-y-2 bg-slate-950/40">
                    <p className="font-bold text-slate-400 text-[8px] uppercase tracking-wider">Upload Job Photos</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-14 border border-dashed border-slate-800 rounded flex flex-col items-center justify-center text-[8px] text-slate-500">
                        <span>Before Photo</span>
                      </div>
                      <div className="h-14 border border-dashed border-slate-800 rounded flex flex-col items-center justify-center text-[8px] text-slate-500">
                        <span>After Photo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Home Indicator bar */}
                <div className="h-4 bg-slate-950 flex items-center justify-center py-2">
                  <div className="w-24 h-1 bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-20 bg-[var(--primary)] text-white text-center relative overflow-hidden transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10 text-slate-950">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {t('ctaTitle') || 'Bring every service job into one flow.'}
          </h2>
          <p className="text-[var(--bg-app)] text-sm max-w-lg mx-auto leading-relaxed">
            {t('ctaSub') || 'Manage clients, allocate job sheets, monitor components, check invoices and track history. Register today.'}
          </p>
          <div className="pt-4">
            <Button size="lg" onClick={() => navigate('/register')} variant="primary" className="bg-slate-950 text-white hover:bg-slate-900 border-none shadow-md">
              {t('ctaRegisterCTA') || 'Onboard Your Business Now'}
            </Button>
          </div>
        </div>
        
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      </section>
      
    </div>
  );
};

export default LandingPage;
