import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const gradients = {
  blue:    'stat-gradient-blue',
  cyan:    'stat-gradient-cyan',
  green:   'stat-gradient-green',
  orange:  'stat-gradient-orange',
  purple:  'stat-gradient-purple',
  rose:    'stat-gradient-rose',
  // aliases used in admin pages
  emerald: 'stat-gradient-green',
  amber:   'stat-gradient-orange',
  slate:   'stat-gradient-blue',
  primary: 'stat-gradient-cyan',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  color,           // alias for gradient (used in admin pages)
  trend,           // { value: number, label: string }
  subtitle,
  subtext,         // alias for subtitle (used in admin pages)
  loading = false,
}) {
  const resolvedGradient = gradient || color || 'blue';
  const resolvedSubtitle = subtitle || subtext;
  const gradientClass = gradients[resolvedGradient] || gradients.blue;

  if (loading) {
    return (
      <div className="ff-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton w-24 h-4" />
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
        <div className="skeleton w-16 h-8 mb-2" />
        <div className="skeleton w-20 h-3" />
      </div>
    );
  }

  return (
    <div className="stat-card-hover ff-card ff-card-lift p-5 group relative overflow-hidden">
      {/* Subtle background mesh */}
      <div className="absolute inset-0 card-gradient-mesh opacity-50 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
          <div className={`${gradientClass} w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
            {Icon && <Icon size={18} color="white" />}
          </div>
        </div>

        <div className="flex items-end gap-3">
          <p className="text-2xl font-800 tracking-tight" style={{ color: 'var(--text-primary)', animation: 'count-up 0.4s ease forwards' }}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-600 mb-0.5 ${
              trend.value > 0 ? 'text-emerald-500' :
              trend.value < 0 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {trend.value > 0 ? <TrendingUp size={12} /> :
               trend.value < 0 ? <TrendingDown size={12} /> :
               <Minus size={12} />}
              <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>

        {(resolvedSubtitle || trend?.label) && (
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            {resolvedSubtitle || trend?.label}
          </p>
        )}
      </div>
    </div>
  );
}
