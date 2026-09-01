import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Calendar, ArrowRight, Activity, Search } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';

const TechJobs = () => {
  const { currentUser, jobs, t } = useContext(AppContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState('active');

  // Filter jobs for logged-in technician
  const techJobs = jobs.filter(j => j.technicianId === currentUser?.technicianId);

  const filteredJobs = techJobs.filter(job => {
    const status = job.status.toLowerCase();
    if (tab === 'active') {
      return ['assigned', 'on the way', 'arrived', 'in progress'].includes(status);
    }
    if (tab === 'completed') {
      return ['completed', 'paid'].includes(status);
    }
    return true; // All
  });

  return (
    <div className="space-y-5 text-left text-[var(--text-primary)]">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">{t('serviceJobs') || 'Your Dispatched Jobs'}</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Manage schedules, track service progress, and update job status cards.</p>
      </div>

      {/* Tabs */}
      <div className="flex border border-[var(--border-color)] rounded-lg p-1 bg-[var(--bg-card)] justify-between text-xs font-bold text-center">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${tab === 'active' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'}`}
        >
          Active Tasks
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${tab === 'completed' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setTab('all')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${tab === 'all' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'}`}
        >
          All Jobs
        </button>
      </div>

      {/* Jobs Directory Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-10 text-center text-[var(--text-secondary)]">
            <Activity className="w-8 h-8 text-[var(--text-secondary)] opacity-60 mx-auto mb-2" />
            <p className="text-xs font-semibold">No jobs found in this folder.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 shadow-xs space-y-4 hover:border-[var(--accent)]/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[var(--text-primary)]">Job #{job.id}</span>
                <StatusBadge status={job.status} />
              </div>

              {/* Body details */}
              <div className="space-y-2.5 text-xs text-[var(--text-secondary)] text-left">
                <div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase">Customer</p>
                  <p className="font-extrabold text-[var(--text-primary)] mt-0.5">{job.customerName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase">Service Requested</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">{job.serviceType}</p>
                </div>
                <div className="flex items-start gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)] opacity-60 shrink-0 mt-0.5" />
                  <p className="font-semibold text-[var(--text-primary)] leading-snug">{job.address}</p>
                </div>
              </div>

              {/* Simulated maps and tel links */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${job.customerPhone}`}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-soft)] hover:bg-[var(--accent)]/10 text-[var(--text-primary)] font-bold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  Call Customer
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-soft)] hover:bg-[var(--accent)]/10 text-[var(--text-primary)] font-bold transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  Directions
                </a>
              </div>

              <hr className="border-[var(--border-color)]/30" />

              {/* Footer row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{job.scheduledDate} ({job.scheduledTime})</span>
                </div>

                <button
                  onClick={() => navigate(`/technician/jobs/${job.id}`)}
                  className="flex items-center gap-1 text-[var(--primary)] hover:text-[var(--primary-dark)] font-bold cursor-pointer"
                >
                  Open Task Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechJobs;
