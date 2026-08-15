import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface VoxelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'emerald' | 'diamond';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
}

export const VoxelButton: React.FC<VoxelButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  active = false,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#228844] hover:bg-[#2AA052] text-white border-[#156631] shadow-[0_2px_0_#0D4420]',
    secondary: 'bg-[#1E222D] hover:bg-[#282E3E] text-[#E2E4EB] border-[#2E3547] shadow-[0_2px_0_#12151D]',
    danger: 'bg-[#C53030] hover:bg-[#E53E3E] text-white border-[#9B2C2C] shadow-[0_2px_0_#742A2A]',
    ghost: 'bg-transparent hover:bg-[#1E222D] text-[#9DA3B4] hover:text-[#E2E4EB] border-transparent shadow-none',
    emerald: 'bg-[#55FF55] hover:bg-[#6EFF6E] text-[#0C0D10] font-semibold border-[#38CC38] shadow-[0_2px_0_#228822]',
    diamond: 'bg-[#55FFFF] hover:bg-[#7AFFFF] text-[#0C0D10] font-semibold border-[#33CCCC] shadow-[0_2px_0_#1A9999]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    icon: 'p-2 text-sm aspect-square flex items-center justify-center',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-medium border rounded transition-all duration-150 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
          variantStyles[variant],
          sizeStyles[size],
          active && 'ring-2 ring-[#55FF55] ring-offset-1 ring-offset-[#0C0D10]',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
