import React, { useContext, useState, useEffect } from 'react';
import { TrendingUp, Briefcase, BarChart3, Award, Package } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { AppContext } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import { reportService } from '../../services/reportService';

const AdminReports = () => {
  const { jobs, technicians, payments, inventory, t } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAnalyticsData({ jobs, technicians, payments, inventory });
        setReportData(data);
      } catch (err) {
        console.error('Error fetching operational reports data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [jobs, technicians, payments, inventory]);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--text-secondary)] space-y-3 font-sans">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-sm">Loading operational analytics...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)] font-sans">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <p className="font-bold">Unable to load operational analytics.</p>
        <p className="text-xs mt-2 opacity-60">Make sure the backend is connected and try refreshing.</p>
      </div>
    );
  }

  const {
    collectedRevenue: totalRevenueVal,
    pendingRevenue: pendingRevenueVal,
    jobsByStatus,
    categoryCounts,
    techWorkloads,
    inventoryHealthData,
    monthlyRevenueData
  } = reportData;

  // Derive healthyStockItems and lowStockItems from inventoryHealthData
  const healthyStockItems = inventoryHealthData?.find(d => d.name === 'Sufficiently Stocked')?.value ?? 0;
  const lowStockItems = inventoryHealthData?.find(d => d.name === 'Low / Out of Stock')?.value ?? 0;

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)] font-sans">
      {/* Header */}
      <div>
        <h1 className="heading-main text-[var(--text-primary)]">{t('analyticsReports') || 'Analytics & Reports'}</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Review operational performance charts, dispatch statistics, and technician delivery metrics.</p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Settled Revenue" value={formatINR(totalRevenueVal)} icon={TrendingUp} color="emerald" subtext="Received payments" />
        <StatCard title="Outstanding Balances" value={formatINR(pendingRevenueVal)} icon={TrendingUp} color="amber" subtext="Uncollected invoice values" />
        <StatCard title="Completed Service Jobs" value={jobsByStatus?.Completed ?? 0} icon={Briefcase} color="blue" subtext={`Out of ${jobs.length} total dispatches`} />
      </div>

      {/* Grid of Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue Monthly Trend (Area Chart) */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" /> {t('revenueGrowth') || 'Revenue Growth Trend (Monthly)'}
            </h3>
            <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">Deposits vs outstanding collections per billing month</p>
          </div>
          <div className="h-64 mt-6 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16805B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16805B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C58A19" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#C58A19" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend />
                <Area type="monotone" dataKey="Revenue" stroke="#16805B" fillOpacity={1} fill="url(#colRev)" name="Paid Revenue" strokeWidth={2} />
                <Area type="monotone" dataKey="Outstanding" stroke="#C58A19" fillOpacity={1} fill="url(#colOut)" name="Outstanding dues" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Jobs by category breakdown (Bar Chart) */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[var(--primary)]" /> {t('jobsByCategory') || 'Jobs by Service Category'}
            </h3>
            <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">Workload count distributed across service categories</p>
          </div>
          <div className="h-64 mt-6 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Bar dataKey="Jobs" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {categoryCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'var(--accent)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Fleet Performance workloads (Stacked Horizontal Bar Chart) */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 shadow-xs flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#16805B]" /> {t('techWorkloads') || 'Technician Dispatch & Completion'}
            </h3>
            <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">Completed jobs vs total tasks assigned per staff agent</p>
          </div>
          <div className="h-64 mt-6 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techWorkloads} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend />
                <Bar dataKey="Completed" fill="#16805B" name="Completed Service" stackId="a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Assigned" fill="var(--accent)" name="Assigned Total" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Inventory Health Spares distribution (Pie Donut Chart) */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 shadow-xs flex flex-col justify-between lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-500" /> Catalog Inventory Health
              </h3>
              <p className="text-[var(--text-secondary)] text-[10px] mt-0.5">Ratio of sufficiently stocked items to critical/low stock warnings</p>
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)]">Total Parts Count: {inventory.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            <div className="h-44 w-44 text-xs shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={inventoryHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {inventoryHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 text-xs flex-grow text-left max-w-md">
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16805B]" /> Sufficiently Stocked</span>
                <span className="font-extrabold text-[var(--text-primary)]">{healthyStockItems} SKUs</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C84B4B]" /> Low / Critical Stock Warnings</span>
                <span className="font-extrabold text-red-600">{lowStockItems} SKUs</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminReports;
