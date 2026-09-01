import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, helper, icon: Icon, iconRight: IconRight, type = 'text', required, className = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-600" style={{ color: 'var(--text-primary)' }}>
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <Icon size={16} />
          </span>
        )}
        <input
          ref={ref}
          type={type}
          required={required}
          className={`ff-input ${Icon ? 'pl-10' : ''} ${IconRight ? 'pr-10' : ''} ${error ? 'border-red-400 focus:border-red-500' : ''}`}
          {...props}
        />
        {IconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <IconRight size={16} />
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs font-500" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {helper}
        </p>
      )}
    </div>
  );
});

export default Input;
