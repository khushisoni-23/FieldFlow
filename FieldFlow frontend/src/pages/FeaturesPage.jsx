import React from 'react';
import {
  Users,
  Briefcase,
  UserCheck,
  Smartphone,
  Package,
  CreditCard,
  BarChart3,
  History,
  CheckCircle
} from 'lucide-react';

const FeaturesPage = () => {
  const sections = [
    {
      icon: Users,
      title: 'Customer Management',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Centralized customer directory with name, contact, and email details.',
        'Store multiple service addresses and physical directions for each customer.',
        'View complete service transaction history directly within the customer profile.',
        'Track active vs. inactive clients and filter profiles instantaneously.'
      ]
    },
    {
      icon: Briefcase,
      title: 'Job Scheduling & Dispatch',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Log new service requests with category, custom problems, and address fields.',
        'Set urgency priorities: Low, Normal, High, and Critical / Urgent.',
        'Schedule specific date and time windows for service appointments.',
        'Filter jobs list by status: Assigned, In Progress, Delayed, or Completed.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Technician Tracking',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Add and manage service technicians with their specific expertise (AC repair, RO, plumbing).',
        'Real-time status updates: Available, On Job, and Offline.',
        'Assign jobs from the admin dispatch screen to technicians in one click.',
        'Prevent booking collisions and verify current workloads immediately.'
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile-Friendly Execution',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Dedicated mobile dashboard layout designed for field technicians on the move.',
        'One-click workflow transitions: On the Way -> Arrived -> Start -> Complete.',
        'Add parts used from the inventory catalog and write field service reports directly from a phone.',
        'Upload before and after photo references for job evidence and record keeping.'
      ]
    },
    {
      icon: Package,
      title: 'Inventory & Materials Management',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Keep a live record of spare parts, filter replacement membranes, and electrical wires.',
        'Track stock quantities and declare custom minimum warning thresholds.',
        'Receive immediate notification alerts when parts drop to Low Stock or Critical Out of Stock.',
        'Automatically deduct quantities from inventory stock levels once a technician logs them on a job.'
      ]
    },
    {
      icon: CreditCard,
      title: 'Billing & Payments tracking',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Itemized service bills combining fixed base service charges and dynamic parts cost.',
        'UPI, cash, and bank transfer options marked directly in the system.',
        'Separate paid transactions from outstanding collections in a single ledger view.',
        'Log revenue collected daily, weekly, or monthly for auditing purposes.'
      ]
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Review total jobs dispatched and check completion ratios.',
        'Monitor monthly revenue performance and compare against outstanding dues.',
        'View job volume splits by service category (AC, electrical, RO, CCTV).',
        'Evaluate individual technician workload logs and jobs completed.'
      ]
    },
    {
      icon: History,
      title: 'Chronological Service History',
      color: 'text-[var(--primary)] bg-[var(--soft-accent)]',
      bullets: [
        'Automatic log entries saved for every job phase update.',
        'Access past diagnostic notes, troubleshooting feedback, and parts replaced for any equipment.',
        'Provide instant reference data for repeat customer calls to increase resolution rates.',
        'Enable team members to pick up where a previous technician left off.'
      ]
    }
  ];

  return (
    <div className="bg-[var(--bg-app)] py-16 md:py-24 text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <span className="text-xs sm:text-sm font-black tracking-widest text-[var(--primary)] uppercase block">FEATURES</span>
          <h1 className="text-3xl sm:text-4.5xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
            Built for Service Operations
          </h1>
          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed editorial-dropcap text-left pt-4">
            FieldFlow equips you with critical tools to streamline customer requests, assign technicians, track inventory, and collect payments.
          </p>
        </div>

        {/* Feature Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.title} className="bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-color)] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-6">
                <div className={`p-4 rounded-xl ${sec.color} h-fit w-fit shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-4 text-left">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{sec.title}</h3>
                  <ul className="space-y-2">
                    {sec.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#16805B] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
