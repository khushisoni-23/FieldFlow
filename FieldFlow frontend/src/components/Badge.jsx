import React from 'react';

const Badge = ({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) => {
  const styles = {
    neutral: 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-color)]',
    primary: 'bg-[var(--soft-accent)] text-[var(--primary)] border-[var(--accent)]/30',
    success: 'bg-emerald-50 dark:bg-[#16805B]/10 text-[#16805B] border-[#16805B]/20',
    warning: 'bg-amber-50 dark:bg-[#C58A19]/10 text-[#C58A19] border-[#C58A19]/20',
    danger: 'bg-rose-50 dark:bg-[#C84B4B]/10 text-[#C84B4B] border-[#C84B4B]/20',
    info: 'bg-blue-50 dark:bg-[#3978B8]/10 text-[#3978B8] border-[#3978B8]/20'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
