import React from 'react';

const variants = {
  primary:   'ff-btn ff-btn-primary btn-shimmer',
  secondary: 'ff-btn ff-btn-secondary',
  danger:    'ff-btn ff-btn-danger',
  ghost:     'ff-btn ff-btn-ghost',
  outline:   'ff-btn ff-btn-outline',
  success:   'ff-btn ff-btn-success btn-shimmer',
};

const sizes = {
  sm:  'py-1.5 px-3 text-xs',
  md:  '',
  lg:  'py-3 px-6 text-base',
  xl:  'py-4 px-8 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className={`ff-spinner ${variant !== 'primary' && variant !== 'danger' ? 'ff-spinner-dark' : ''}`} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <span className="shrink-0"><Icon size={16} /></span>}
          {children}
          {IconRight && <span className="shrink-0"><IconRight size={16} /></span>}
        </>
      )}
    </button>
  );
}
