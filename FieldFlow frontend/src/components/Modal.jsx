import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footerActions, size = 'md', noPadding = false }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm:  'max-w-md',
    md:  'max-w-xl',
    lg:  'max-w-2xl',
    xl:  'max-w-4xl',
    full:'max-w-6xl',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{ background: 'rgba(10,16,30,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className={`modal-transition w-full ${sizes[size] || sizes.md} flex flex-col`}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <h2 className="text-lg font-700" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 hover:scale-105"
            style={{
              background: 'var(--bg-surface-soft)',
              color: 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface-soft)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={`overflow-y-auto ${noPadding ? '' : 'p-6'} flex-1`}>
          {children}
        </div>

        {/* Footer — shown only when footerActions are provided */}
        {footerActions && (
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
}
