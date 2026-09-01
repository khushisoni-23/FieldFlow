import React from 'react';
import {
  PhoneCall,
  PlusSquare,
  UserPlus2,
  Navigation,
  Wrench,
  Camera,
  CheckSquare,
  IndianRupee,
  History
} from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: PhoneCall,
      title: '1. Customer Request',
      desc: 'A customer calls about a breakdown or books a service online. The admin logs their contact details, physical address, and appliance specifications.',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: PlusSquare,
      title: '2. Create Job Card',
      desc: 'The admin creates a Job Card in the system, selecting the service category (e.g. AC Repair) and defining the priority based on urgency.',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: UserPlus2,
      title: '3. Assign Technician',
      desc: 'The admin checks available staff specialist lists and assigns the job to Ramesh, Amit, or other field technicians, sending it to their device.',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: Navigation,
      title: '4. Technician Travels',
      desc: 'The technician receives the task on their mobile dashboard, reads the customer address, and transitions the status to "On The Way".',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: Wrench,
      title: '5. Service Execution',
      desc: 'Once at the customer door, the technician marks "Arrived" and begins debugging. They update the job to "In Progress" as they execute repairs.',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: Camera,
      title: '6. Log Parts & Photos',
      desc: 'The technician logs spare materials used (e.g., Capacitor) directly from the parts list, writes diagnostic notes, and takes before/after job photos.',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: CheckSquare,
      title: '7. Complete Job',
      desc: 'The technician inputs service labor fees, checks calculated spare parts billing totals, writes final recommendations, and clicks "Complete Job".',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: IndianRupee,
      title: '8. Record Payment',
      desc: 'The technician collects the invoice total via UPI or Cash, marking the transaction as Paid, which instantly logs it in the office payments ledger.',
      color: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/20'
    },
    {
      icon: History,
      title: '9. Archive to History',
      desc: 'The job is stored permanently under the customer profile, building a chronological service directory to make future maintenance calls easy.',
      color: 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-color)]'
    }
  ];

  return (
    <div className="bg-[var(--bg-app)] py-16 md:py-24 text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <span className="text-xs sm:text-sm font-black tracking-widest text-[var(--primary)] uppercase block">HOW IT WORKS</span>
          <h1 className="text-3xl sm:text-4.5xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
            Streamlining Your Field Operations
          </h1>
          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed editorial-dropcap text-left pt-4">
            From the minute a customer registers an issue to the final payment deposit and history archive, FieldFlow keeps your operations unified.
          </p>
        </div>

        {/* Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                <div className={`p-4 rounded-xl border ${step.color} mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
