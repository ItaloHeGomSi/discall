import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'danger' | 'success' | 'warning' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'muted', className }) => {
  const styles = {
    accent: 'bg-[#1B2340] text-[#93A6FF] border-[#3B4A8C]',
    danger: 'bg-[#3A1616] text-[#FF8080] border-[#7A2A2A]',
    success: 'bg-[#12321F] text-[#5EDB8F] border-[#1F6A3D]',
    warning: 'bg-[#332510] text-[#F5B84D] border-[#7A5A1A]',
    muted: 'bg-[#1F242F] text-[#9AA3B2] border-[#333A48]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium border rounded uppercase tracking-wide',
          styles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
