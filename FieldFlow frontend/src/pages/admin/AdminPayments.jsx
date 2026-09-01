import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, ArrowRight, IndianRupee, CheckCircle, Clock, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';

const AdminPayments = () => {
  const { payments, t } = useContext(AppContext);
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Calculate stats
  const totalPaid = (payments || [])
    .filter(p => p && p.status === 'Paid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalPending = (payments || [])
    .filter(p => p && p.status === 'Pending')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const grandTotal = totalPaid + totalPending;

  const filteredPayments = (payments || []).filter(p => {
    if (!p) return false;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || (
      (p.id && p.id.toLowerCase().includes(query)) ||
      (p.jobId && p.jobId.toLowerCase().includes(query)) ||
      (p.customerName && p.customerName.toLowerCase().includes(query))
    );
    
    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Header panel */}
      <div>
        <h1 className="heading-main text-[var(--text-primary)]">{t('payments') || 'Payments Ledger'}</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Track customer billing accounts, settled transactions, and cash/UPI collections.</p>
      </div>

      {/* Metric summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title={t('revenueSettled') || "Total Revenue Settled"} value={formatINR(totalPaid)} icon={CheckCircle} color="emerald" subtext="Funds deposited" />
        <StatCard title="Outstanding Balance" value={formatINR(totalPending)} icon={Clock} color="amber" subtext="Pending service invoice collections" />
        <StatCard title={t('accumulatedBookings') || "Accumulated Bookings"} value={formatINR(grandTotal)} icon={CreditCard} color="blue" subtext="Grand billing value" />
      </div>

      {/* Table grid container */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs overflow-hidden flex flex-col">
        {/* Filter bars */}
        <div className="p-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative text-[var(--text-secondary)] w-full sm:max-w-md flex items-center">
            <Search className="w-4.5 h-4.5 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchPayments') || "Search by Job ID or Customer Name..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-surface-soft)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs w-full font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-surface-soft)] cursor-pointer touch-target flex items-center justify-center"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-1 border border-[var(--border-color)] p-1 rounded-lg bg-[var(--bg-surface-soft)] w-full sm:w-auto justify-around text-xs">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${statusFilter === 'All' ? 'bg-[var(--bg-card)] shadow-xs text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${statusFilter === 'Paid' ? 'bg-[var(--bg-card)] shadow-xs text-[#16805B]' : 'text-[var(--text-secondary)]'}`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${statusFilter === 'Pending' ? 'bg-[var(--bg-card)] shadow-xs text-[#C58A19]' : 'text-[var(--text-secondary)]'}`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Mobile Cards List (Visible only on small screens) */}
        <div className="block lg:hidden divide-y divide-[var(--border-color)]">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <p className="font-bold text-sm">No transactions found.</p>
              <p className="text-xs mt-1">Try changing your search or filters.</p>
            </div>
          ) : (
            filteredPayments.map((p) => (
              <div 
                key={p.id}
                onClick={() => navigate(`/admin/jobs/${p.jobId}`)}
                className="p-5 hover:bg-[var(--bg-surface-soft)]/20 cursor-pointer transition-colors space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-sm text-[var(--primary)]">{p.jobId}</span>
                    <span className="text-[10px] text-[var(--text-secondary)] block font-mono">ID: {p.id}</span>
                  </div>
                  <Badge variant={p.status === 'Paid' ? 'success' : 'warning'}>
                    {p.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] text-left">
                  <span>Customer: <strong className="text-[var(--text-primary)]">{p.customerName}</strong></span>
                  <span className="font-black text-[var(--text-primary)]">{formatINR(p.amount)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/30 text-xs text-left">
                  <span className="text-[var(--text-secondary)]">Date: {p.date}</span>
                  <span className="text-[var(--text-secondary)] font-medium">Via: {p.paymentMethod || 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ledger Table (Visible only on large screens) */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg-surface-soft)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase font-semibold">
                <th className="px-6 py-3">Job ID</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Service Bill Amount</th>
                <th className="px-6 py-3">Receive Method</th>
                <th className="px-6 py-3">Transaction Date</th>
                <th className="px-6 py-3 text-right">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--text-secondary)] text-sm">
                    <p className="font-bold text-sm">No transactions found.</p>
                    <p className="text-xs mt-1">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-[var(--bg-surface-soft)]/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/jobs/${p.jobId}`)}
                  >
                    <td className="px-6 py-3.5 font-bold text-[var(--primary)] flex items-center gap-1.5 text-left">
                      <span>{p.jobId}</span>
                      <ArrowRight className="w-3 h-3 text-[var(--text-secondary)] opacity-55" />
                    </td>
                    <td className="px-6 py-3.5 font-bold text-[var(--text-primary)] text-left">{p.customerName}</td>
                    <td className="px-6 py-3.5 font-black text-[var(--text-primary)] text-xs text-left">{formatINR(p.amount)}</td>
                    <td className="px-6 py-3.5 font-medium text-[var(--text-secondary)] text-left">{p.paymentMethod || 'N/A'}</td>
                    <td className="px-6 py-3.5 text-[var(--text-secondary)] opacity-85 text-left">{p.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      <Badge variant={p.status === 'Paid' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
