import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Wrench, Calendar, FileText, CheckCircle, CreditCard, Clock } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import JobStatusTimeline from '../../components/JobStatusTimeline';
import Select from '../../components/Select';

const AdminJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, technicians, updateJobStatus, collectPayment, t } = useContext(AppContext);

  const job = jobs.find(j => j.id === id);
  const [statusInput, setStatusInput] = useState(job ? job.status : '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  if (!job) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p className="text-slate-400">Job card not found.</p>
        <Button variant="outline" onClick={() => navigate('/admin/jobs')} className="mt-4">
          Back to Jobs
        </Button>
      </div>
    );
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusInput(newStatus);
    updateJobStatus(job.id, newStatus);
  };

  const handleCollectPayment = () => {
    collectPayment(job.id, paymentMethod);
  };

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const statusOptions = [
    { label: 'Pending Dispatch', value: 'Pending' },
    { label: 'Assigned to Staff', value: 'Assigned' },
    { label: 'On The Way', value: 'On The Way' },
    { label: 'Arrived at Site', value: 'Arrived' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed Services', value: 'Completed' },
    { label: 'Paid & Settled', value: 'Paid' },
    { label: 'Delayed / Hold', value: 'Delayed' }
  ];

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dispatch
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[var(--text-primary)]">Job Card {job.id}</h1>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
              job.priority === 'Urgent' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200/30' :
              job.priority === 'High' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/30' : 
              'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border border-[var(--border-color)]'
            }`}>
              {job.priority} Priority
            </span>
          </div>
        </div>
        
        {/* Status quick control dropdown */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg shadow-xs w-fit">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Admin Status Force:</span>
          <select 
            value={statusInput} 
            onChange={handleStatusChange}
            className="text-xs font-bold text-[var(--text-primary)] focus:outline-none border-none cursor-pointer pr-4 bg-[var(--bg-card)]"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[var(--bg-card)]">{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline view */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5">
        <h3 className="font-bold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)] mb-4">Job Execution Progress</h3>
        <JobStatusTimeline currentStatus={job.status} />
      </div>

      {/* Main Details Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Customers, Technicians and Job notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Customer & Location */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border-color)]">Customer Location Details</h3>
            <div className="flex flex-col sm:flex-row gap-6 text-xs text-[var(--text-secondary)]">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Client Contact</p>
                    <p className="font-bold text-[var(--text-primary)] text-sm mt-0.5">{job.customerName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Phone Number</p>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">{job.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex gap-2 text-left">
                <div className="p-1.5 bg-[var(--soft-accent)] text-[var(--primary)] rounded-lg h-fit">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Physical Location</p>
                  <p className="font-semibold text-[var(--text-primary)] mt-0.5 leading-relaxed">{job.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Service Description & Diagnostic report */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border-color)]">Diagnostics & Findings</h3>
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Service Category Requested</p>
                <p className="font-bold text-[var(--text-primary)] text-sm mt-0.5">{job.serviceType}</p>
              </div>

              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Reported Issues</p>
                <p className="font-semibold text-[var(--text-primary)] leading-relaxed mt-1 bg-[var(--bg-surface-soft)]/50 p-3 rounded-lg border border-[var(--border-color)]/30">
                  {job.problemDescription}
                </p>
              </div>

              {job.notes && (
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Technician Notes & Comments</p>
                  <p className="text-[var(--text-primary)] leading-relaxed mt-1 bg-[var(--bg-surface-soft)]/50 p-3 rounded-lg border border-[var(--border-color)]/30 italic">
                    "{job.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Photos upload logs */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border-color)]">Job Reference Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mb-2">Before Service</p>
                {job.beforePhoto ? (
                  <img src={job.beforePhoto} alt="Before repair" className="rounded-lg object-cover h-40 w-full border border-[var(--border-color)] shadow-2xs" />
                ) : (
                  <div className="h-40 rounded-lg bg-[var(--bg-surface-soft)] border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] text-xs font-medium">
                    No image uploaded before work.
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mb-2">After Service Completion</p>
                {job.afterPhoto ? (
                  <img src={job.afterPhoto} alt="After repair" className="rounded-lg object-cover h-40 w-full border border-[var(--border-color)] shadow-2xs" />
                ) : (
                  <div className="h-40 rounded-lg bg-[var(--bg-surface-soft)] border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] text-xs font-medium">
                    No image uploaded after work.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Assigned technician, billing & payments */}
        <div className="space-y-6">
          
          {/* Technician Assignment Card */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border-color)]">Assigned Technician</h3>
            {job.technicianId ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--soft-accent)] text-[var(--primary)] flex items-center justify-center font-bold">
                  {job.technicianName ? job.technicianName.charAt(0) : 'T'}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[var(--text-primary)]">{job.technicianName || 'Technician'}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Technician ID: {job.technicianId}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[var(--text-secondary)]">
                No technician assigned. Edit status to assign staff.
              </div>
            )}
          </div>

          {/* Job Invoice / Billing summary card */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border-color)]">Service Billing Invoice</h3>
            
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Labor Service Charge</span>
                <span className="font-bold text-[var(--text-primary)]">{formatINR(job.serviceCharge)}</span>
              </div>

              {job.partsUsed && job.partsUsed.length > 0 && (
                <div className="space-y-1.5 border-t border-[var(--border-color)]/30 pt-2">
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">Materials Used Spares:</p>
                  {job.partsUsed.map((part, index) => (
                    <div key={index} className="flex justify-between text-[11px] pl-2">
                      <span className="text-[var(--text-secondary)]">{part.partName} (x{part.quantity})</span>
                      <span className="font-semibold text-[var(--text-primary)]">{formatINR(part.price * part.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-[var(--border-color)]/30 pt-1.5 mt-1 font-semibold text-[var(--text-primary)]">
                    <span>Total Spares Charge</span>
                    <span>{formatINR(job.partsCost)}</span>
                  </div>
                </div>
              )}

              <hr className="border-[var(--border-color)]/30 my-1" />

              <div className="flex justify-between font-black text-[var(--text-primary)] text-sm">
                <span>Grand Total Amount</span>
                <span>{formatINR(job.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Collect Payment panel (only if payment is Pending) */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border-color)]">Outstanding Balance</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Status:</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                job.paymentStatus === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border-[#16805B]/20' : 'bg-rose-50 dark:bg-rose-950/20 text-[#C84B4B] border-[#C84B4B]/20'
              }`}>
                {job.paymentStatus}
              </span>
            </div>

            {job.paymentStatus === 'Pending' ? (
              <div className="space-y-3 pt-2 text-xs">
                <Select
                  label="Receive Mode"
                  options={[
                    { label: 'UPI (GPay/PhonePe)', value: 'UPI' },
                    { label: 'Cash', value: 'Cash' },
                    { label: 'Bank Transfer', value: 'Bank Transfer' }
                  ]}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                
                <Button 
                  variant="success" 
                  className="w-full mt-2" 
                  icon={CreditCard}
                  onClick={handleCollectPayment}
                >
                  Collect {formatINR(job.totalAmount)}
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-[#16805B]/20 rounded-lg text-[#16805B] text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4.5 h-4.5" />
                <span>Job completely settled via {job.paymentMethod}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminJobDetails;
