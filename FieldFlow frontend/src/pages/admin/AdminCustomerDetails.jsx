import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Wrench, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, jobs, payments, t } = useContext(AppContext);

  // Find target customer
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p className="text-slate-400">Customer profile not found.</p>
        <Button variant="outline" onClick={() => navigate('/admin/customers')} className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

  // Filter jobs for this customer
  const customerJobs = jobs.filter(j => j.customerId === id);
  const completedJobsCount = customerJobs.filter(j => j.status === 'Completed').length;
  const pendingJobsCount = customerJobs.length - completedJobsCount;

  // Calculate spent
  const totalSpent = payments
    .filter(p => p.customerName === customer.name && p.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Top action row */}
      <div>
        <button
          onClick={() => navigate('/admin/customers')}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </button>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">{t('customerDetails') || 'Customer Profile'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Profile Card Details */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-6 h-fit">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)] text-white font-extrabold text-lg flex items-center justify-center">
              {customer.name ? customer.name.charAt(0) : 'C'}
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">{customer.name || 'Customer'}</h2>
              <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border border-[#16805B]/20">
                {customer.status}
              </span>
            </div>
          </div>

          <hr className="border-[var(--border-color)]/30" />

          {/* Contacts */}
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-2.5 text-[var(--text-secondary)]">
              <Phone className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--text-secondary)] font-normal">Contact Phone</p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[var(--text-secondary)]">
              <Mail className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--text-secondary)] font-normal">Email Address</p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">{customer.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--text-secondary)] font-normal">{t('billingAddress') || 'Billing & Service Address'}</p>
                <p className="font-semibold text-[var(--text-primary)] mt-0.5 leading-relaxed">{customer.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Metrics summary & History timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-4 text-center">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Total Jobs</p>
              <p className="text-lg font-black text-[var(--text-primary)] mt-1">{customerJobs.length}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-4 text-center">
              <p className="text-[10px] font-bold text-[#16805B] uppercase tracking-wider">Completed</p>
              <p className="text-lg font-black text-[#16805B] mt-1">{completedJobsCount}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-4 text-center">
              <p className="text-[10px] font-bold text-[#C58A19] uppercase tracking-wider">Pending</p>
              <p className="text-lg font-black text-[#C58A19] mt-1">{pendingJobsCount}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-4 text-center">
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">{t('totalSpent') || 'Total Spend'}</p>
              <p className="text-lg font-black text-[var(--primary)] mt-1">{formatINR(totalSpent)}</p>
            </div>
          </div>

          {/* Service History Logs Card */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5">
            <h3 className="font-bold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)] mb-5">{t('pastJobs') || 'Job Service History Timeline'}</h3>

            {customerJobs.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-8 text-center">No service jobs logged for this customer yet.</p>
            ) : (
              <div className="space-y-4">
                {customerJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-4 border border-[var(--border-color)] rounded-lg hover:border-[var(--accent)]/50 cursor-pointer bg-[var(--bg-surface-soft)]/20 hover:bg-[var(--bg-surface-soft)]/50 transition-all flex flex-col sm:flex-row justify-between gap-4"
                    onClick={() => navigate(`/admin/jobs/${job.id}`)}
                  >
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[var(--primary)] text-xs">{job.id}</span>
                        <span className="font-bold text-[var(--text-primary)] text-xs">{job.serviceType}</span>
                        <StatusBadge status={job.status} />
                      </div>
                      
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{job.problemDescription}</p>
                      
                      {job.notes && (
                        <p className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-card)] p-2 border border-[var(--border-color)] rounded italic">
                          "{job.notes}"
                        </p>
                      )}

                      {/* Parts Summary */}
                      {job.partsUsed && job.partsUsed.length > 0 && (
                        <div className="text-[10px] flex items-center gap-1 text-[var(--text-secondary)] flex-wrap">
                          <span className="font-bold uppercase tracking-wider opacity-85">Parts replaced:</span>
                          {job.partsUsed.map((p, idx) => (
                            <span key={idx} className="bg-[var(--bg-surface-soft)] px-2 py-0.5 rounded border border-[var(--border-color)] font-medium">
                              {p.partName} (x{p.quantity})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="sm:text-right shrink-0 flex flex-col justify-between items-start sm:items-end gap-2">
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{job.scheduledDate}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Total Bill</p>
                        <p className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5">
                          {job.totalAmount > 0 ? formatINR(job.totalAmount) : 'Pending Diagnostics'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetails;
