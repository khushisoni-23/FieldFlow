import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Package,
  IndianRupee,
  Calendar,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { AppContext } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';

const AdminDashboard = () => {
  const { jobs, technicians, inventory, payments, currentUser, language, t } = useContext(AppContext);
  const navigate = useNavigate();

  // 1. Calculate Metrics Dynamically
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayJobs = (jobs || []).filter(j => j && j.scheduledDate === todayDateStr);
  
  const totalJobsCount = (jobs || []).length;
  const completedJobsCount = (jobs || []).filter(j => j && j.status === 'Completed').length;
  const inProgressJobsCount = (jobs || []).filter(j => j && (j.status === 'In Progress' || j.status === 'Arrived' || j.status === 'On The Way')).length;
  const pendingJobsCount = (jobs || []).filter(j => j && (j.status === 'Pending' || j.status === 'Assigned')).length;
  const delayedJobsCount = (jobs || []).filter(j => j && j.status === 'Delayed').length;

  const collectedRevenue = (payments || [])
    .filter(p => p && p.status === 'Paid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const pendingRevenue = (payments || [])
    .filter(p => p && p.status === 'Pending')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalRevenue = collectedRevenue + pendingRevenue;

  // 2. Fetch Low Stock Items
  const lowStockItems = (inventory || []).filter(item => item && (item.status === 'Low Stock' || item.status === 'Critical'));

  // Format helper
  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Recharts Chart Data
  const monthlyRevenueData = [
    { name: 'May 2026', Revenue: 22000 },
    { name: 'Jun 2026', Revenue: 34000 },
    { name: 'Jul 2026', Revenue: 48000 },
    { name: 'Aug 2026', Revenue: totalRevenue }
  ];

  const jobsStatusData = [
    { name: t('completed') || 'Completed', value: completedJobsCount || 1, color: '#16805B' },
    { name: t('inProgress') || 'In Progress', value: inProgressJobsCount || 1, color: '#3978B8' },
    { name: t('pending') || 'Pending', value: pendingJobsCount || 1, color: '#C58A19' },
    { name: t('delayed') || 'Delayed', value: delayedJobsCount || 0, color: '#C84B4B' }
  ].filter(d => d.value > 0);

  return (
    <div className="slide-up-fade space-y-6 text-left">
      
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-main text-[var(--text-primary)]">Good morning, {currentUser?.name || 'Admin'} 👋</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Here is what's happening across your service fleet today.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2 rounded-lg shadow-xs w-fit">
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-bold text-[var(--text-primary)]">
            {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Jobs" value={totalJobsCount} icon={Briefcase} color="slate" subtext="All-time jobs registered" />
        <StatCard title="Completed" value={completedJobsCount} icon={CheckCircle} color="emerald" subtext={`${completedJobsCount} jobs closed successfully`} />
        <StatCard title="In Progress" value={inProgressJobsCount} icon={Clock} color="blue" subtext="Technicians currently in field" />
        <StatCard title="Pending" value={pendingJobsCount} icon={AlertCircle} color="amber" subtext="Waiting for staff or travel" />
      </div>

      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Collected Revenue" value={formatINR(collectedRevenue)} icon={IndianRupee} color="emerald" subtext="Deposits in UPI & cash" />
        <StatCard title="Outstanding Dues" value={formatINR(pendingRevenue)} icon={AlertCircle} color="amber" subtext="Invoices pending payment" />
        <StatCard title="Total Booked Value" value={formatINR(totalRevenue)} icon={TrendingUp} color="primary" subtext="Total services generated" />
      </div>

      {/* Analytical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Overview (Area Chart) */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm">{t('revenueGrowth') || 'Revenue Overview (Monthly)'}</h3>
            <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">Total booked service transactions accumulated monthly</p>
          </div>
          <div className="h-64 mt-4 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Area type="monotone" dataKey="Revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs Status Distribution (Pie Chart) */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Jobs status</h3>
            <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">Current active vs completed split</p>
          </div>
          <div className="h-64 mt-4 w-full flex items-center justify-center text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobsStatusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Jobs Directory Table */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">{t('todaysCalendar') || "Today's Jobs Calendar"}</h3>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/jobs')}>
              {t('allJobs') || 'All Jobs'}
            </Button>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-surface-soft)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase font-semibold">
                  <th className="px-5 py-3">Job ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Technician</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {todayJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-[var(--text-secondary)]">
                      No jobs scheduled for today. Click Jobs to schedule one.
                    </td>
                  </tr>
                ) : (
                  todayJobs.map(job => (
                    <tr 
                      key={job.id} 
                      className="hover:bg-[var(--bg-surface-soft)]/40 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}
                    >
                      <td className="px-5 py-3.5 font-bold text-[var(--primary)]">{job.id}</td>
                      <td className="px-5 py-3.5 text-[var(--text-primary)] font-medium">{job.customerName}</td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{job.serviceType}</td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{job.technicianName}</td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] opacity-80">{job.scheduledTime}</td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Technicians Status & Inventory Alerts */}
        <div className="space-y-6">
          
          {/* Technician Fleet Panel */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
              <h3 className="font-bold text-[var(--text-primary)]">{t('fleetStatus') || 'Technician Fleet Status'}</h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/admin/technicians')} className="p-0 text-[var(--primary)] hover:text-[var(--primary-dark)] text-xs cursor-pointer">
                {t('manage') || 'Manage'}
              </Button>
            </div>
            
            <div className="space-y-3">
              {technicians.map(tech => (
                <div key={tech.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border-color)]/30 bg-[var(--bg-surface-soft)]/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--soft-accent)] text-[var(--primary)] flex items-center justify-center font-bold text-xs">
                      {tech.name ? tech.name.charAt(0) : 'T'}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-xs">{tech.name || 'Technician'}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{tech.specialization}</p>
                    </div>
                  </div>
                  <span className={`
                    text-[11px] font-bold px-2 py-0.5 rounded-full border
                    ${tech.status === 'Available' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100/50' : ''}
                    ${tech.status === 'On Job' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50' : ''}
                    ${tech.status === 'Offline' ? 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-color)]' : ''}
                  `}>
                    {tech.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Materials Warning Panel */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-500" /> {t('lowStockAlerts') || 'Low Stock Alerts'}
              </h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/admin/inventory')} className="p-0 text-[var(--primary)] hover:text-[var(--primary-dark)] text-xs cursor-pointer">
                {t('refill') || 'Refill'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)] text-center py-4">All spares are sufficiently stocked.</p>
              ) : (
                lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border border-red-100/30 bg-red-50/10 text-xs">
                    <div className="text-left">
                      <p className="font-bold text-[var(--text-primary)]">{item.partName}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono">SKU: {item.sku}</p>
                    </div>
                    <span className={`
                      font-bold px-2 py-0.5 rounded text-[11px]
                      ${item.status === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'}
                    `}>
                      {item.stock} LEFT
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
