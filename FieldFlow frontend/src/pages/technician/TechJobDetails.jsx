import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Wrench, ShieldAlert, CreditCard, Camera, Check, Plus, Trash2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Select from '../../components/Select';
import Input from '../../components/Input';

const TechJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, inventory, updateJobStatus, completeJobDetails, collectPayment, t } = useContext(AppContext);

  const job = jobs.find(j => j.id === id);

  // Completion Form State
  const [serviceNotes, setServiceNotes] = useState('');
  const [serviceCharge, setServiceCharge] = useState(350);
  const [partsUsed, setPartsUsed] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Simulated upload mock
  const [beforePhoto, setBeforePhoto] = useState(job ? job.beforePhoto : '');
  const [afterPhoto, setAfterPhoto] = useState('');

  if (!job) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p className="text-slate-400">Job card not found.</p>
        <Button variant="outline" onClick={() => navigate('/technician/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Handle status progression
  const handleTransition = (nextStatus) => {
    updateJobStatus(job.id, nextStatus);
  };

  const handleAddPartRow = () => {
    if (!selectedPartId) return;
    const part = inventory.find(p => p.id === selectedPartId);
    if (!part) return;

    if (part.stock < selectedQty) {
      alert(`Warning: Insufficient stock available. Only ${part.stock} units remaining.`);
      return;
    }

    // Check if already added
    const existing = partsUsed.find(p => p.partId === selectedPartId);
    if (existing) {
      setPartsUsed(prev => prev.map(p => p.partId === selectedPartId ? { ...p, quantity: p.quantity + Number(selectedQty) } : p));
    } else {
      const newPartUsed = {
        partId: part.id,
        partName: part.partName,
        quantity: Number(selectedQty),
        price: part.price
      };
      setPartsUsed(prev => [...prev, newPartUsed]);
    }

    setSelectedPartId('');
    setSelectedQty(1);
  };

  const handleRemovePartRow = (partId) => {
    setPartsUsed(prev => prev.filter(p => p.partId !== partId));
  };

  const handleFinalComplete = (e) => {
    e.preventDefault();
    if (!serviceNotes) {
      alert('Please input service notes detailing your diagnostics and repair.');
      return;
    }

    // Mock upload pictures
    const defaultAfterImage = job.serviceType.includes('RO')
      ? 'https://images.unsplash.com/photo-1613967193442-19cfb7eb0515?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      : 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';

    completeJobDetails(job.id, {
      notes: serviceNotes,
      serviceCharge: Number(serviceCharge),
      partsUsed,
      beforePhoto: beforePhoto || 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      afterPhoto: afterPhoto || defaultAfterImage,
      paymentStatus,
      paymentMethod
    });
  };

  const handleQuickCollectPayment = () => {
    collectPayment(job.id, 'UPI');
  };

  // Calculations
  const partsTotalCost = partsUsed.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const grandTotalCost = Number(serviceCharge) + partsTotalCost;

  const partOptions = inventory.map(item => ({
    label: `${item.partName} (Price: ₹${item.price} | Stock: ${item.stock})`,
    value: item.id
  }));

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-5 pb-10 text-left text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/technician/jobs')}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
        <span className="font-extrabold text-xs text-[var(--text-primary)]">Job #{job.id}</span>
      </div>

      {/* Basic Job Details Card */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4 shadow-sm text-sm">
        <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]/30">
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider">Requested Service</p>
            <p className="font-black text-[var(--text-primary)] text-base mt-1">{job.serviceType}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Client & Address Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider">Customer</p>
              <p className="font-extrabold text-[var(--text-primary)] text-base mt-0.5">{job.customerName}</p>
              <a href={`tel:${job.customerPhone}`} className="text-[var(--primary)] font-bold hover:underline block mt-1.5 touch-target flex items-center">
                {job.customerPhone} (Call Customer)
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider">Service Location Address</p>
              <p className="font-semibold text-[var(--text-primary)] leading-relaxed mt-0.5">{job.address}</p>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-[var(--primary)] font-bold hover:underline block mt-1.5 touch-target flex items-center"
              >
                Open Google Maps directions
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Wrench className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider">Problem Details</p>
              <p className="font-semibold text-[var(--text-primary)] leading-relaxed mt-1 bg-[var(--bg-surface-soft)]/50 p-3 rounded-lg border border-[var(--border-color)]/30">
                {job.problemDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WORKFLOW CONTROLLER PANEL */}
      {/* Only show workflow triggers if not completed */}
      {!['Completed', 'Paid'].includes(job.status) ? (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm space-y-4 text-sm">
          <h3 className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-wider heading-section">Service Workflow Actions</h3>
          
          <div className="flex flex-col gap-3">
            {job.status === 'Assigned' && (
              <Button 
                variant="primary" 
                className="w-full py-3.5 text-base" 
                onClick={() => handleTransition('On The Way')}
              >
                🚗 Start Travelling (On The Way)
              </Button>
            )}

            {job.status === 'On The Way' && (
              <Button 
                variant="primary" 
                className="w-full py-3" 
                onClick={() => handleTransition('Arrived')}
              >
                📍 Arrived at Customer Site
              </Button>
            )}

            {job.status === 'Arrived' && (
              <Button 
                variant="primary" 
                className="w-full py-3" 
                onClick={() => handleTransition('In Progress')}
              >
                🔧 Start Diagnostic Work (In Progress)
              </Button>
            )}

            {/* In Progress Service Form */}
            {job.status === 'In Progress' && (
              <form onSubmit={handleFinalComplete} className="space-y-4">
                <hr className="border-[var(--border-color)]/30" />
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Job Completion & Materials Sheet</h4>

                {/* Notes */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">
                    Service Notes & Findings <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Details about diagnostics (e.g., replaced capacitor, cleaned wet filters, checked pressure...)"
                    className="block w-full rounded-lg border border-[var(--border-color)] text-base md:text-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                  />
                </div>

                {/* Spares Picker */}
                <div className="space-y-2.5 p-3.5 bg-[var(--bg-surface-soft)]/50 border border-[var(--border-color)]/30 rounded-lg">
                  <p className="text-[11px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Used Spare Parts Picker</p>
                  
                  <div className="flex gap-2">
                    <Select
                      options={partOptions}
                      placeholder="Choose spare..."
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Number(e.target.value))}
                      className="w-16"
                    />
                    <Button 
                      onClick={handleAddPartRow} 
                      variant="outline"
                      className="px-2"
                    >
                      <Plus className="w-4.5 h-4.5" />
                    </Button>
                  </div>

                  {/* Added Parts list */}
                  {partsUsed.length > 0 && (
                    <div className="space-y-1.5 mt-2 border-t border-[var(--border-color)]/30 pt-2">
                      {partsUsed.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[var(--bg-card)] p-2 border border-[var(--border-color)] rounded text-[11px]">
                          <span className="font-bold text-[var(--text-primary)]">{p.partName} (x{p.quantity})</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[var(--text-primary)]">{formatINR(p.price * p.quantity)}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePartRow(p.partId)}
                              className="text-rose-500 hover:text-rose-600 p-0.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photos Simulation */}
                <div className="space-y-2.5 p-3.5 bg-[var(--bg-surface-soft)]/50 border border-[var(--border-color)]/30 rounded-lg">
                  <p className="text-[11px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Service Visual Evidence</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      label="Before Photo URL Mock"
                      value={beforePhoto}
                      onChange={(e) => setBeforePhoto(e.target.value)}
                      placeholder="Unsplash outdoor/breakdown AC image URL"
                    />
                    <Input
                      label="After Photo URL Mock"
                      value={afterPhoto}
                      onChange={(e) => setAfterPhoto(e.target.value)}
                      placeholder="Unsplash clean service image URL"
                    />
                  </div>
                </div>

                {/* Charges */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Labor Service Charge"
                    type="number"
                    required
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                  />
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1.5">Material Spares Cost</label>
                    <p className="py-2.5 font-bold text-[var(--text-primary)] text-sm">{formatINR(partsTotalCost)}</p>
                  </div>
                </div>

                {/* Payment terms */}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Collected Status"
                    options={[
                      { label: 'UPI / Cash Paid', value: 'Paid' },
                      { label: 'Pending Dues', value: 'Pending' }
                    ]}
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  />
                  <Select
                    label="Payment Type"
                    options={[
                      { label: 'UPI (GPay/Paytm)', value: 'UPI' },
                      { label: 'Hard Cash', value: 'Cash' }
                    ]}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </div>

                <div className="border-t border-[var(--border-color)]/30 pt-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[var(--text-secondary)] font-semibold uppercase text-[11px]">Calculated Invoice</p>
                    <p className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5">{formatINR(grandTotalCost)}</p>
                  </div>
                  <Button type="submit" variant="success" className="py-2.5 px-6">
                    <Check className="w-4 h-4 mr-1.5" /> Complete Service
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* Settlement Status for completed jobs */
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm space-y-4 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]/30">
            <h3 className="font-black text-[var(--text-primary)] heading-section">Settled Service Details</h3>
            <span className="bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border border-[#16805B]/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Completed
            </span>
          </div>

          <div className="space-y-3.5 text-left">
            <div>
              <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase">Technician Notes logged</p>
              <p className="font-semibold text-[var(--text-primary)] leading-relaxed mt-1 bg-[var(--bg-surface-soft)]/50 p-2.5 rounded-lg border border-[var(--border-color)]/35 italic">
                "{job.notes}"
              </p>
            </div>

            {job.partsUsed && job.partsUsed.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase">Materials Used Spares:</p>
                <div className="space-y-1">
                  {job.partsUsed.map((p, idx) => (
                    <div key={idx} className="flex justify-between pl-2 font-semibold text-[var(--text-secondary)]">
                      <span>{p.partName} (x{p.quantity})</span>
                      <span>{formatINR(p.price * p.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[var(--border-color)]/30 pt-3 flex justify-between font-black text-[var(--text-primary)] text-sm">
              <span>Grand Total Paid</span>
              <span>{formatINR(job.totalAmount)}</span>
            </div>

            {/* If completed but payment is pending, allow technician to record cash/UPI */}
            {job.paymentStatus === 'Pending' ? (
              <Button 
                variant="success" 
                className="w-full py-3" 
                icon={CreditCard}
                onClick={handleQuickCollectPayment}
              >
                Collect UPI / Cash Settlement: {formatINR(job.totalAmount)}
              </Button>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-[#16805B]/20 rounded-lg text-[#16805B] font-bold text-center flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>Job completely settled via {job.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechJobDetails;
