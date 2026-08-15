import React, { useState, useRef, useEffect } from 'react';
import { renderAvatarToCanvas } from '../../utils/canvasComposer';
import { AvatarComposition } from '../../types/skin.types';
import { BiomeDimensionTheme } from '../../types/call.types';

interface AvatarFlipCardProps {
  avatarConfig: AvatarComposition;
  realPhotoUrl?: string;
  isSpeaking: boolean;
  size?: number;
  dimensionTheme?: BiomeDimensionTheme;
  className?: string;
}

export const AvatarFlipCard: React.FC<AvatarFlipCardProps> = ({
  avatarConfig,
  realPhotoUrl,
  isSpeaking,
  size = 110,
  dimensionTheme = 'plains',
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderAvatarToCanvas(canvasRef.current, avatarConfig);
    }
  }, [avatarConfig]);

  const handleDoubleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const getDimensionBorder = () => {
    if (isSpeaking) {
      return 'border-[#55FF55] shadow-[0_0_16px_rgba(85,255,85,0.7)] ring-2 ring-[#55FF55]';
    }
    switch (dimensionTheme) {
      case 'nether':
        return 'border-[#FF5555]/60 hover:border-[#FF5555]';
      case 'the_end':
        return 'border-[#B565D8]/60 hover:border-[#B565D8]';
      case 'deep_dark':
        return 'border-[#3A82FF]/60 hover:border-[#3A82FF]';
      case 'plains':
      default:
        return 'border-[#2E3547] hover:border-[#3C445C]';
    }
  };

  return (
    <div
      className={`relative cursor-pointer select-none group perspective-1000 ${className}`}
      style={{ width: size, height: size }}
      onDoubleClick={handleDoubleClick}
      title="Clique duplo para alternar entre Skin Minecraft e Foto Real"
    >
      <div
        className={`w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Lado Frontal: Avatar Procedural Minecraft Canvas */}
        <div
          className={`absolute inset-0 backface-hidden rounded-lg border-2 p-1 bg-[#1A1D26] flex items-center justify-center transition-all ${getDimensionBorder()}`}
        >
          <canvas
            ref={canvasRef}
            width={64}
            height={64}
            className="w-full h-full image-rendering-pixelated drop-shadow-md"
          />
        </div>

        {/* Lado Traseiro: Foto Real */}
        <div
          className={`absolute inset-0 backface-hidden rounded-lg border-2 p-1 bg-[#1A1D26] flex items-center justify-center rotate-y-180 transition-all ${getDimensionBorder()}`}
        >
          {realPhotoUrl ? (
            <img
              src={realPhotoUrl}
              alt="Real Avatar"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-[#242936] rounded flex flex-col items-center justify-center text-center p-2">
              <span className="text-xl">📸</span>
              <span className="text-[10px] text-[#9DA3B4] font-mono mt-1">Foto Real</span>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de Flip sutil ao passar o mouse */}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded px-1 text-[9px] font-mono text-[#9DA3B4] pointer-events-none">
        2x Clique
      </div>
    </div>
  );
};
