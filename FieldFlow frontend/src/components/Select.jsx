import React from 'react';

const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className = '',
  required = false,
  helpText,
  placeholder,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <select
          id={selectId}
          ref={ref}
          className={`
            block w-full rounded-lg border text-base md:text-sm transition-all duration-150 py-3 px-4 pr-10 bg-[var(--bg-card)] text-[var(--text-primary)] appearance-none cursor-pointer shadow-2xs focus-ring
            ${error
              ? 'border-[#C84B4B] text-[#C84B4B] focus:outline-none focus:ring-2 focus:ring-[#C84B4B]/20 focus:border-[#C84B4B] bg-[#C84B4B]/5'
              : 'border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
            }
            disabled:bg-[var(--bg-surface-soft)] disabled:text-[var(--text-secondary)] disabled:border-[var(--border-color)]
          `}
          {...props}
        >
          {placeholder && <option value="" className="bg-[var(--bg-card)] text-[var(--text-secondary)]">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[var(--text-secondary)]">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center" id={`${selectId}-error`}>
          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {!error && helpText && (
        <p className="mt-1.5 text-xs text-[var(--text-secondary)] font-normal">{helpText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
