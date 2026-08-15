import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { VoxelButton } from './VoxelButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Overlay Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${widthClasses[maxWidth]} bg-[#14161C] border border-[#2B3142] rounded-lg shadow-2xl overflow-hidden z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222634] bg-[#1A1D26]">
          <div>
            <h3 className="text-base font-semibold text-[#F0F2F8] flex items-center gap-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#9DA3B4] mt-0.5">{subtitle}</p>
            )}
          </div>
          <VoxelButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar"
            className="text-[#9DA3B4] hover:text-white"
          >
            <X className="w-4 h-4" />
          </VoxelButton>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
