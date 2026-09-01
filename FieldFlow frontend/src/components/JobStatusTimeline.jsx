import React from 'react';
import { CheckCircle2, Clock, Truck, MapPin, Play, CheckCircle, CreditCard } from 'lucide-react';

const JobStatusTimeline = ({ currentStatus }) => {
  const steps = [
    { key: 'Pending', label: 'Pending', icon: Clock },
    { key: 'Assigned', label: 'Assigned', icon: CheckCircle2 },
    { key: 'On The Way', label: 'On The Way', icon: Truck },
    { key: 'Arrived', label: 'Arrived', icon: MapPin },
    { key: 'In Progress', label: 'In Progress', icon: Play },
    { key: 'Completed', label: 'Completed', icon: CheckCircle },
    { key: 'Paid', label: 'Paid', icon: CreditCard }
  ];

  const getStepIndex = (status) => {
    const normalized = (status || '').toLowerCase().trim().replace(/\s+/g, '');
    const mappings = {
      'pending': 0,
      'assigned': 1,
      'ontheway': 2,
      'arrived': 3,
      'inprogress': 4,
      'completed': 5,
      'paid': 6
    };
    return mappings[normalized] ?? 0;
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Timeline */}
      <div className="hidden md:flex items-center justify-between w-full relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--border-color)] -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[var(--primary)] -translate-y-1/2 transition-all duration-500 z-0" 
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isCompleted ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs' : ''}
                ${isActive ? 'bg-[var(--bg-card)] border-[var(--primary)] text-[var(--primary)] ring-4 ring-[var(--soft-accent)]' : ''}
                ${isPending ? 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]' : ''}
              `}>
                <StepIcon className="w-4 h-4" />
              </div>
              <span className={`
                mt-2 text-[11px] font-bold tracking-wide uppercase
                ${isActive ? 'text-[var(--primary)]' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="flex flex-col md:hidden gap-3 relative pl-6 border-l-2 border-[var(--border-color)] ml-4">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div key={step.key} className="relative flex items-center gap-3 py-1">
              {/* Timeline Indicator Dot */}
              <div className={`
                absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-2 bg-[var(--bg-card)] transition-all
                ${isCompleted ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs' : ''}
                ${isActive ? 'border-[var(--primary)] text-[var(--primary)] ring-2 ring-[var(--soft-accent)]' : ''}
                ${isPending ? 'border-[var(--border-color)] text-[var(--text-secondary)]' : ''}
              `}>
                <StepIcon className="w-2.5 h-2.5" />
              </div>

              <span className={`
                text-xs font-bold tracking-wide
                ${isActive ? 'text-[var(--primary)]' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobStatusTimeline;
