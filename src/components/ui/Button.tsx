import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  active = false,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#5B7CFA] hover:bg-[#7089FB] text-white border-[#4763D6]',
    secondary: 'bg-[#1F242F] hover:bg-[#262C3A] text-[#E2E4EB] border-[#333A48]',
    danger: 'bg-[#EF4444] hover:bg-[#F16565] text-white border-[#C53030]',
    ghost: 'bg-transparent hover:bg-[#1F242F] text-[#9AA3B2] hover:text-[#E2E4EB] border-transparent',
    success: 'bg-[#22C55E] hover:bg-[#3DDB74] text-white border-[#178A42]',
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
          'inline-flex items-center justify-center font-medium border rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
          variantStyles[variant],
          sizeStyles[size],
          active && 'ring-2 ring-[#5B7CFA] ring-offset-1 ring-offset-[#0B0D12]',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
