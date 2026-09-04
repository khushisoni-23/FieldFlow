import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, Clock, MapPin, User, AlertTriangle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';

const AdminCreateJob = () => {
  const { customers, technicians, createJob, t } = useContext(AppContext);
  const navigate = useNavigate();

  // Form State
  const [customerId, setCustomerId] = useState('');
  const [serviceType, setServiceType] = useState('AC Repair');
  const [problemDescription, setProblemDescription] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [address, setAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [technicianId, setTechnicianId] = useState('');

  // UI state
  const [errors, setErrors] = useState({});

  // Auto-fill address when customer is selected
  useEffect(() => {
    if (customerId) {
      const selected = customers.find(c => c.id === customerId);
      if (selected) {
        setAddress(selected.address);
      }
    } else {
      setAddress('');
    }
  }, [customerId, customers]);

  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    const newErrors = {};
    if (!customerId) newErrors.customerId = 'Please select a customer.';
    if (!serviceType) newErrors.serviceType = 'Please select a service type.';
    if (!problemDescription) newErrors.problemDescription = 'Please describe the problem.';
    if (!address) newErrors.address = 'Please specify the service address.';
    if (!scheduledDate) newErrors.scheduledDate = 'Please select a scheduled date.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createJob({
        customerId,
        serviceType,
        problemDescription,
        priority,
        address,
        scheduledDate,
        scheduledTime,
        technicianId
      });

      navigate('/admin/jobs');
    } catch (err) {
      setSubmitError(err.message || 'Failed to create job card. Please try again.');
    }
  };

  const serviceOptions = [
    { label: 'AC Repair Service', value: 'AC Repair' },
    { label: 'AC General Service', value: 'AC Service' },
    { label: 'RO Wet Service & Filters', value: 'RO Service' },
    { label: 'Electrical Wiring & Repair', value: 'Electrical Repair' },
    { label: 'Plumbing Repair', value: 'Plumbing' },
    { label: 'CCTV Install & Config', value: 'CCTV Installation' },
    { label: 'Other Service', value: 'Other' }
  ];

  const priorityOptions = [
    { label: 'Low Urgency', value: 'Low' },
    { label: 'Normal Urgency', value: 'Normal' },
    { label: 'High Urgency', value: 'High' },
    { label: 'Critical / Urgent', value: 'Urgent' }
  ];

  const customerOptions = customers.map(c => ({
    label: `${c.name} (${c.phone})`,
    value: c.id
  }));

  const techOptions = technicians
    .filter(t => t.status === 'Available' || t.status === 'On Job')
    .map(t => ({
      label: `${t.name} — ${t.specialization} (${t.status})`,
      value: t.id
    }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left text-[var(--text-primary)]">
      {/* Action header */}
      <div>
        <button
          onClick={() => navigate('/admin/jobs')}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">{t('createJobCard') || 'Create Job Card'}</h1>
      </div>

      {/* Main card form */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitError && (
            <div className="p-3 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-lg">
              {submitError}
            </div>
          )}
          
          <Select
            label="Customer Profile"
            options={customerOptions}
            required
            placeholder="Select a registered customer..."
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            error={errors.customerId}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Service Type Category"
              options={serviceOptions}
              required
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              error={errors.serviceType}
            />

            <Select
              label="Priority Level"
              options={priorityOptions}
              required
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center">
              Detailed Problem Description <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Provide specific details about the issue (e.g., brand, error code, leaking valves...)"
              className={`
                block w-full rounded-lg border text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--bg-card)] text-[var(--text-primary)]
                ${errors.problemDescription ? 'border-rose-300 focus:ring-rose-500' : 'border-[var(--border-color)]'}
              `}
            />
            {errors.problemDescription && <p className="text-rose-600 font-medium text-[10px] mt-1">{errors.problemDescription}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center">
              Service Location Address <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Will auto-fill upon choosing customer above..."
              className={`
                block w-full rounded-lg border text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--bg-card)] text-[var(--text-primary)]
                ${errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-[var(--border-color)]'}
              `}
            />
            {errors.address && <p className="text-rose-600 font-medium text-[10px] mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Scheduled Date"
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              error={errors.scheduledDate}
            />

            <Input
              label="Scheduled Time Window"
              type="text"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              placeholder="e.g. 10:00 AM or Afternoon slot"
            />
          </div>

          <Select
            label="Assign Technician (Optional)"
            options={techOptions}
            placeholder="Keep unassigned (Pending dispatch)..."
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            helpText="Only available and active field technicians are shown."
          />

          <hr className="border-[var(--border-color)]/30 my-1" />

          {/* Action triggers */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate('/admin/jobs')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule & Dispatch
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminCreateJob;
