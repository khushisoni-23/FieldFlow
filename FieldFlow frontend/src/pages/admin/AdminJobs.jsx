import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Calendar, Eye, ShieldAlert, List, Kanban, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Badge from '../../components/Badge';

const AdminJobs = () => {
  const { jobs, technicians, t } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const isScheduleView = location.search.includes('view=schedule');

  const filterTabs = [
    { label: t('allJobs') || 'All Jobs', value: 'All' },
    { label: t('pending') || 'Pending', value: 'Pending' },
    { label: t('assigned') || 'Assigned', value: 'Assigned' },
    { label: t('inField') || 'In Field', value: 'In Field' }, // Custom group: On The Way, Arrived, In Progress
    { label: t('completed') || 'Completed', value: 'Completed' },
    { label: t('paid') || 'Paid', value: 'Paid' },
    { label: t('delayed') || 'Delayed', value: 'Delayed' }
  ];

  // Priority styling
  const getPriorityVariant = (priority) => {
    if (!priority) return 'neutral';
    switch (priority.toLowerCase()) {
      case 'low': return 'neutral';
      case 'medium':
      case 'normal': return 'primary';
      case 'high': return 'warning';
      case 'urgent': return 'danger';
      default: return 'neutral';
    }
  };

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    if (!job) return false;
    // 1. Search Query filter
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || (
      (job.id && job.id.toLowerCase().includes(query)) ||
      (job.customerName && job.customerName.toLowerCase().includes(query)) ||
      (job.technicianName && job.technicianName.toLowerCase().includes(query)) ||
      (job.serviceType && job.serviceType.toLowerCase().includes(query))
    );

    if (!matchesSearch) return false;

    // 2. Priority Filter
    if (priorityFilter !== 'All') {
      if (!job.priority || job.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }
    }

    // 3. Status Tab filter
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return job.status === 'Pending';
    if (statusFilter === 'Assigned') return job.status === 'Assigned';
    if (statusFilter === 'Completed') return job.status === 'Completed';
    if (statusFilter === 'Paid') return job.paymentStatus === 'Paid';
    if (statusFilter === 'Delayed') return job.status === 'Delayed';
    
    // In Field grouping
    if (statusFilter === 'In Field') {
      return job.status && ['on the way', 'arrived', 'in progress'].includes(job.status.toLowerCase());
    }

    return true;
  });

  // Schedule dispatch board technicians derived dynamically from current technician dataset
  const scheduleColumns = [
    ...technicians.map(t => ({
      id: t.id,
      name: t.name,
      specialization: `${t.specialization} Specialist`
    })),
    { id: null, name: 'Unassigned Queue', specialization: 'Requires dispatch' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header action panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-main text-[var(--text-primary)]">
            {isScheduleView ? (t('scheduleCalendar') || 'Technician Dispatch Board') : (t('serviceJobs') || 'Service Jobs')}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isScheduleView 
              ? 'Schedule cards by dispatcher. Map jobs horizontally across technician active shifts.' 
              : 'Schedule new tickets, assign technicians, track travel, and complete billing.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={isScheduleView ? List : Kanban}
            onClick={() => navigate(isScheduleView ? '/admin/jobs' : '/admin/jobs?view=schedule')}
          >
            {isScheduleView ? 'Table view' : 'Dispatch board'}
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => navigate('/admin/jobs/create')}
          >
            {t('createJobCard') || 'Create Job Card'}
          </Button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4.5 h-4.5 absolute left-3 pointer-events-none text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder={t('searchJobs') || "Search by Job ID, customer, service, tech..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-10 py-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-surface-soft)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs w-full font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-surface-soft)] cursor-pointer touch-target flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end items-center">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-[var(--border-color)] text-xs bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] font-bold cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          {(searchQuery || priorityFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('All');
                setStatusFilter('All');
              }}
              className="px-3.5 py-2.5 rounded-lg border border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 font-bold text-xs cursor-pointer transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tabs Area */}
      {!isScheduleView && (
        <div className="flex overflow-x-auto border-b border-[var(--border-color)] gap-2 pb-px scrollbar-none text-xs">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`
                px-4 py-2.5 font-bold border-b-2 whitespace-nowrap -mb-px transition-colors cursor-pointer
                ${statusFilter === tab.value
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Panel views */}
      {isScheduleView ? (
        /* Dispatch Kanban Board view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {scheduleColumns.map(col => {
            const colJobs = filteredJobs.filter(j => j.technicianId === col.id);
            return (
              <div key={col.id || 'unassigned'} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 flex flex-col min-h-[400px] shadow-xs">
                {/* Header */}
                <div className="pb-3 border-b border-[var(--border-color)] mb-4 text-left">
                  <p className="font-extrabold text-[var(--text-primary)] text-xs truncate">{col.name}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{col.specialization}</p>
                  <span className="inline-block mt-2 bg-[var(--soft-accent)] text-[var(--primary)] px-2 py-0.5 rounded-full text-[9px] font-bold">
                    {colJobs.length} active jobs
                  </span>
                </div>

                {/* Cards stack */}
                <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px]">
                  {colJobs.length === 0 ? (
                    <div className="h-32 border border-dashed border-[var(--border-color)] rounded-lg flex items-center justify-center text-[10px] text-[var(--text-secondary)]">
                      No jobs allocated
                    </div>
                  ) : (
                    colJobs.map(job => (
                      <div
                        key={job.id}
                        onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        className="bg-[var(--bg-app)] hover:bg-[var(--bg-surface-soft)] border border-[var(--border-color)] rounded-lg p-3 text-left space-y-2 cursor-pointer shadow-2xs hover:shadow-xs transition-all duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[var(--primary)] text-[10px]">{job.id}</span>
                          <Badge variant={getPriorityVariant(job.priority)} className="text-[8px] px-1.5">
                            {job.priority}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)] text-xs truncate">{job.customerName}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] font-semibold mt-0.5">{job.serviceType}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/30 text-[9px] text-[var(--text-secondary)]">
                          <span>{job.scheduledTime}</span>
                          <StatusBadge status={job.status} className="text-[8px] px-1.5" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs overflow-hidden flex flex-col">

          {/* Directory Table */}
          {/* Mobile Cards List (Visible only on small screens) */}
          <div className="block lg:hidden divide-y divide-[var(--border-color)]">
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)]">
                <p className="font-bold text-sm">No jobs found matching these filters.</p>
                <p className="text-xs mt-1">Try changing your search or filters.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => navigate(`/admin/jobs/${job.id}`)}
                  className="p-5 hover:bg-[var(--bg-surface-soft)]/20 cursor-pointer transition-colors space-y-3.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-[var(--primary)]">{job.id}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="space-y-1 text-xs text-left">
                    <p className="font-bold text-[var(--text-primary)] text-sm">{job.customerName}</p>
                    <p className="text-[var(--text-primary)] font-medium">{job.serviceType}</p>
                    <p className="text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.scheduledDate} ({job.scheduledTime})</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/35 text-xs text-left">
                    <span className="text-[var(--text-secondary)] font-medium">Tech: {job.technicianName}</span>
                    <Badge variant={getPriorityVariant(job.priority)}>{job.priority}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Directory Table (Visible only on large screens) */}
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-surface-soft)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase font-semibold">
                  <th className="px-6 py-3">Job ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service Type</th>
                  <th className="px-6 py-3">Technician</th>
                  <th className="px-6 py-3">Scheduled Slot</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-[var(--text-secondary)] text-sm">
                      <p className="font-bold text-sm">No jobs found matching these filters.</p>
                      <p className="text-xs mt-1">Try changing your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr 
                      key={job.id} 
                      className="hover:bg-[var(--bg-surface-soft)]/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}
                    >
                      <td className="px-6 py-3.5 font-bold text-[var(--primary)]">{job.id}</td>
                      <td className="px-6 py-3.5 text-[var(--text-primary)] font-bold">{job.customerName}</td>
                      <td className="px-6 py-3.5 text-[var(--text-primary)] font-medium">{job.serviceType}</td>
                      <td className="px-6 py-3.5 text-[var(--text-secondary)]">{job.technicianName}</td>
                      <td className="px-6 py-3.5 text-[var(--text-secondary)] opacity-85">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{job.scheduledDate} ({job.scheduledTime})</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant={getPriorityVariant(job.priority)}>
                          {job.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/jobs/${job.id}`)}
                          className="p-2 text-[var(--primary)] hover:text-[var(--primary-dark)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                          title="View Job details"
                          aria-label="View Job details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
