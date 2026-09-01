import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Wind,
  Droplet,
  Zap,
  Wrench,
  Video,
  CheckCircle2
} from 'lucide-react';

const SolutionsPage = () => {
  const location = useLocation();

  const industries = [
    {
      icon: Wind,
      name: 'AC & Appliance Repair',
      desc: 'Simplify HVAC jobs. Track refrigerant charges, capacitors, fan motors, and wet service cycles.',
      bullets: [
        'Organize split/window AC installation and troubleshooting.',
        'Track copper wire lengths and gas refills (R32, R410).',
        'Assign specialist HVAC mechanics immediately.',
        'Store visual logs of condenser and evaporator coil states.'
      ]
    },
    {
      icon: Droplet,
      name: 'RO / Water Purifier Service',
      desc: 'Never miss a filter change. Monitor membrane health, TDS levels, and pump pressure tests.',
      bullets: [
        'Track cartridge swaps, pre-filters, and inline carbons.',
        'Schedule recurring annual maintenance contracts (AMCs).',
        'Input pre-service and post-service water TDS readings.',
        'Log filter replacement dates to trigger future reminders.'
      ]
    },
    {
      icon: Zap,
      name: 'Electrician Businesses',
      desc: 'Deploy wiremen safely. Schedule short circuit diagnostics, home electrical repairs, and DB board replacements.',
      bullets: [
        'Provide safety check checklist options to technicians.',
        'Track copper wire bundle lengths and switch gear parts.',
        'Allocate urgent power outage requests to closest technicians.',
        'Verify itemized bills for wiring meters and socket fixtures.'
      ]
    },
    {
      icon: Wrench,
      name: 'Plumbing Services',
      desc: 'Keep leak repairs flow under control. Track plumbing parts, pipe lengths, tape washers, and valve replacements.',
      bullets: [
        'Log tap leakages, pipeline blockages, and sanitary setups.',
        'Record parts used like brass bib taps, valves, and thread sealants.',
        'Upload photo confirmations of repaired or replaced joints.',
        'Manage fixed rate service charges alongside material bills.'
      ]
    },
    {
      icon: Video,
      name: 'CCTV Installation & Maintenance',
      desc: 'Track camera positions, BNC connectors, DVR power adapters, and ethernet cable installations.',
      bullets: [
        'Record serial numbers of installed security cameras.',
        'Track networking parts like RJ45 pins, connectors, and switch channels.',
        'Store configuration parameters (IP, port, channels) in job notes.',
        'Log camera view angle screenshot links in service logs.'
      ]
    }
  ];

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const targetName = location.state.scrollTo.toLowerCase();
      const match = industries.find(ind => 
        ind.name.toLowerCase().includes(targetName) || 
        targetName.includes(ind.name.toLowerCase())
      );
      if (match) {
        const id = match.name.replace(/\s+/g, '-').toLowerCase();
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-[var(--primary)]', 'duration-500');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-[var(--primary)]');
            }, 2000);
          }, 150);
        }
      }
    }
  }, [location]);

  return (
    <div className="bg-[var(--bg-app)] py-16 md:py-24 text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <span className="text-xs sm:text-sm font-black tracking-widest text-[var(--primary)] uppercase block">SOLUTIONS</span>
          <h1 className="text-3xl sm:text-4.5xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
            Tailored for Your Trade
          </h1>
          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed editorial-dropcap text-left pt-4">
            Whether you repair ACs, service RO systems, run electrical wiring, swap plumbing taps, or install CCTV cameras, FieldFlow matches your operations.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="space-y-12">
          {industries.map((ind, index) => {
            const Icon = ind.icon;
            return (
              <div 
                key={ind.name}
                id={ind.name.replace(/\s+/g, '-').toLowerCase()}
                className={`
                  flex flex-col lg:flex-row gap-8 bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-color)] shadow-xs hover:shadow-md transition-all duration-200
                  ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}
                `}
              >
                <div className="lg:w-1/3 space-y-4 flex flex-col justify-center text-left">
                  <div className="p-3 bg-[var(--soft-accent)] text-[var(--primary)] rounded-xl w-fit">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{ind.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{ind.desc}</p>
                </div>

                <div className="lg:w-2/3 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-center text-left">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">How it helps your workflow</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ind.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#16805B] shrink-0 mt-0.5" />
                        <span className="text-xs text-[var(--text-secondary)] leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SolutionsPage;
