import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, Calendar, ChevronRight, Phone, MapPin } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';

const TechDashboard = () => {
  const { currentUser, jobs, t } = useContext(AppContext);
  const navigate = useNavigate();

  // Find jobs assigned to this technician
  const techJobs = jobs.filter(j => j.technicianId === currentUser?.technicianId);
  
  // Calculate today's date metrics dynamically
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayJobs = techJobs.filter(j => j.scheduledDate === todayDateStr);
  const activeJobs = techJobs.filter(j => ['assigned', 'on the way', 'arrived', 'in progress'].includes(j.status.toLowerCase()));
  const completedJobs = techJobs.filter(j => j.status === 'Completed');

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Greetings Header */}
      <div className="bg-[var(--primary)] text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <p className="text-xs uppercase font-extrabold tracking-wider opacity-85">{t('roleTech') || 'Field Agent Console'}</p>
          <h1 className="text-2xl md:text-3xl font-black heading-main">Good morning, {currentUser?.name || 'Technician'}</h1>
          <p className="text-sm md:text-base opacity-95 leading-relaxed pt-1">
            You have <span className="font-extrabold">{activeJobs.length} active jobs</span> assigned to you today.
          </p>
        </div>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      </div>

      {/* Metrics Row (Comfortable large boxes) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-color)] text-center shadow-xs">
          <p className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Today's Tasks</p>
          <p className="text-2xl font-black text-[var(--text-primary)] mt-1.5">{todayJobs.length}</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-color)] text-center shadow-xs">
          <p className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-black text-blue-600 mt-1.5">{activeJobs.length}</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-color)] text-center shadow-xs">
          <p className="text-xs font-extrabold text-[#16805B] uppercase tracking-wider">Closed</p>
          <p className="text-2xl font-black text-[#16805B] mt-1.5">{completedJobs.length}</p>
        </div>
      </div>

      {/* Assigned Tasks list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase text-[var(--text-secondary)] tracking-wider heading-section">Your Assigned Jobs</h2>
          <button 
            onClick={() => navigate('/technician/jobs')}
            className="text-xs font-extrabold text-[var(--primary)] hover:text-[var(--primary-dark)] cursor-pointer"
          >
            See All ({techJobs.length})
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-10 text-center text-[var(--text-secondary)] shadow-xs">
            <CheckCircle className="w-10 h-10 text-[#16805B] mx-auto mb-3" />
            <p className="text-sm font-bold text-[var(--text-primary)]">All caught up!</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">No pending active tasks left for you.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm space-y-4 hover:border-[var(--accent)]/50 transition-all duration-250 hover:shadow-md"
              >
                {/* ID & Status */}
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm text-[var(--text-primary)]">Job #{job.id}</span>
                  <StatusBadge status={job.status} />
                </div>

                {/* Service Details */}
                <div className="text-sm space-y-3.5 text-left">
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider">Customer Profile</p>
                    <p className="font-extrabold text-[var(--text-primary)] text-base mt-1">{job.customerName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-extrabold uppercase tracking-wider">Service Requested</p>
                    <p className="font-extrabold text-[var(--primary)] text-sm mt-1">{job.serviceType}</p>
                  </div>

                  <div className="flex items-start gap-2 text-[var(--text-secondary)] pt-1">
                    <MapPin className="w-4.5 h-4.5 shrink-0 text-[var(--text-secondary)] opacity-60 mt-0.5" />
                    <p className="leading-relaxed text-xs font-semibold">{job.address}</p>
                  </div>
                </div>

                <hr className="border-[var(--border-color)]/30" />

                {/* Actions row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-semibold">
                    <Calendar className="w-4 h-4" />
                    <span>{job.scheduledTime}</span>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/technician/jobs/${job.id}`)}
                    className="inline-flex items-center justify-center gap-1.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-150 cursor-pointer touch-target active:scale-[0.98]"
                    aria-label={`Open Job task ${job.id}`}
                  >
                    Open Task
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechDashboard;
