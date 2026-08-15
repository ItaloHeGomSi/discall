import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface VoxelBadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'redstone' | 'diamond' | 'gold' | 'amethyst' | 'muted';
  className?: string;
}

export const VoxelBadge: React.FC<VoxelBadgeProps> = ({
  children,
  variant = 'muted',
  className,
}) => {
  const styles = {
    emerald: 'bg-[#153D22] text-[#55FF55] border-[#228844]',
    redstone: 'bg-[#3D1515] text-[#FF5555] border-[#882222]',
    diamond: 'bg-[#153A3D] text-[#55FFFF] border-[#227788]',
    gold: 'bg-[#3D2E15] text-[#FFAA00] border-[#886622]',
    amethyst: 'bg-[#2E153D] text-[#B565D8] border-[#662288]',
    muted: 'bg-[#1E222D] text-[#9DA3B4] border-[#2E3547]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono font-medium border rounded-xs tracking-wider uppercase',
          styles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
