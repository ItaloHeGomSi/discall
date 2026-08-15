import React, { useRef, useEffect } from 'react';
import { renderAvatarToCanvas } from '../../utils/canvasComposer';
import { AvatarComposition } from '../../types/skin.types';

interface CanvasAvatarRendererProps {
  avatarConfig: AvatarComposition;
  size?: number;
  className?: string;
}

export const CanvasAvatarRenderer: React.FC<CanvasAvatarRendererProps> = ({
  avatarConfig,
  size = 48,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderAvatarToCanvas(canvasRef.current, avatarConfig);
    }
  }, [avatarConfig]);

  return (
    <div
      className={`relative inline-block overflow-hidden rounded bg-[#1A1D26] border border-[#2B3142] ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        className="w-full h-full image-rendering-pixelated"
      />
    </div>
  );
};
