import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCallStore } from '../../stores/callStore';
import { CanvasAvatarRenderer } from '../../components/avatar/CanvasAvatarRenderer';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { Flame, Volume2, Sparkles, Navigation, Play, Pause } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

export const CampfireLoungeView: React.FC = () => {
  const { user } = useAuthStore();
  const { joinRoom, isInCall } = useCallStore();

  const [myPos, setMyPos] = useState<Position>({ x: 280, y: 220 });
  const [alexPos] = useState<Position>({ x: 380, y: 180 });
  const [notcherPos] = useState<Position>({ x: 180, y: 190 });
  const [isPlayingFireSound, setIsPlayingFireSound] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Controle de movimento com teclado WASD / Setas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 15;
      setMyPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') newY = Math.max(40, prev.y - step);
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') newY = Math.min(360, prev.y + step);
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') newX = Math.max(40, prev.x - step);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') newX = Math.min(560, prev.x + step);

        return { x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0C0D10] overflow-hidden select-none">
      {/* Header do Lounge */}
      <div className="h-14 border-b border-[#222634] px-6 flex items-center justify-between bg-[#14161C] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#3D2215] border border-[#FF8822] flex items-center justify-center text-[#FF8822]">
            <Flame className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-[#F0F2F8] flex items-center gap-2">
              Campfire Voice Lounge (Lobby Interativo)
            </h2>
            <p className="text-xs text-[#9DA3B4]">
              Aguarde seus amigos ao redor da fogueira com áudio espacial 2D.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlayingFireSound(!isPlayingFireSound)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
              isPlayingFireSound
                ? 'bg-[#153D22] border-[#228844] text-[#55FF55]'
                : 'bg-[#1E222D] border-[#2B3142] text-[#9DA3B4]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Fogueira: {isPlayingFireSound ? 'ON' : 'OFF'}</span>
          </button>

          {!isInCall && (
            <VoxelButton
              variant="emerald"
              size="sm"
              onClick={() => joinRoom('campfire-lounge', 'Lobby da Fogueira 🏕️', 'server')}
            >
              Conectar Voz
            </VoxelButton>
          )}
        </div>
      </div>

      {/* Cenário Interativo 2D */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden bg-[#07080A]">
        {/* Cenário de Acampamento */}
        <div
          ref={containerRef}
          className="relative w-[600px] h-[400px] bg-[#121E14] border-4 border-[#1E3320] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(#1A3820 15%, transparent 16%), radial-gradient(#152E1A 15%, transparent 16%)',
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        >
          {/* Fogueira Central (Campfire) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* Brilho da fogueira */}
            <div className="absolute w-36 h-36 rounded-full bg-[#FF8822]/20 blur-xl animate-pulse" />
            
            {/* Troncos e Fogo */}
            <div className="w-14 h-14 bg-[#3B1F0B] border-2 border-[#5C3212] rounded-lg flex items-center justify-center text-2xl shadow-lg z-10">
              🔥
            </div>
            <span className="text-[10px] font-mono text-[#FF8822] font-bold mt-1 bg-black/60 px-1.5 py-0.5 rounded">
              Fogueira
            </span>
          </div>

          {/* Troncos para sentar em volta */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#3B1F0B] border border-[#5C3212] rounded-sm flex items-center justify-center text-[10px] font-mono text-[#9DA3B4]">
            Tronco de Carvalho
          </div>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#3B1F0B] border border-[#5C3212] rounded-sm flex items-center justify-center text-[10px] font-mono text-[#9DA3B4]">
            Tronco de Carvalho
          </div>

          {/* Avatar do Usuário (Você - Móvel) */}
          {user && (
            <div
              className="absolute z-20 flex flex-col items-center transition-all duration-75 pointer-events-none"
              style={{ top: myPos.y, left: myPos.x }}
            >
              <CanvasAvatarRenderer
                avatarConfig={user.avatarConfig}
                size={40}
                className="ring-2 ring-[#55FF55] shadow-lg"
              />
              <span className="text-[10px] font-mono bg-black/75 text-[#55FF55] px-1 rounded mt-0.5 font-bold">
                Você
              </span>
            </div>
          )}

          {/* Amigos ao Redor da Fogueira */}
          <div
            className="absolute z-10 flex flex-col items-center"
            style={{ top: alexPos.y, left: alexPos.x }}
          >
            <div className="w-10 h-10 rounded bg-[#1A1D26] border border-[#2B3142] flex items-center justify-center text-lg">
              🏹
            </div>
            <span className="text-[10px] font-mono bg-black/75 text-[#E2E4EB] px-1 rounded mt-0.5">
              AlexExplorer
            </span>
          </div>

          <div
            className="absolute z-10 flex flex-col items-center"
            style={{ top: notcherPos.y, left: notcherPos.x }}
          >
            <div className="w-10 h-10 rounded bg-[#1A1D26] border border-[#2B3142] flex items-center justify-center text-lg">
              ⚙️
            </div>
            <span className="text-[10px] font-mono bg-black/75 text-[#E2E4EB] px-1 rounded mt-0.5">
              RedstoneLord
            </span>
          </div>
        </div>

        {/* Dica de Controles */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#9DA3B4] bg-[#14161C] border border-[#222634] px-4 py-2 rounded-lg">
          <Navigation className="w-4 h-4 text-[#55FF55]" />
          <span>Use as teclas <kbd className="bg-[#1E222D] px-1 py-0.5 rounded text-white">W</kbd> <kbd className="bg-[#1E222D] px-1 py-0.5 rounded text-white">A</kbd> <kbd className="bg-[#1E222D] px-1 py-0.5 rounded text-white">S</kbd> <kbd className="bg-[#1E222D] px-1 py-0.5 rounded text-white">D</kbd> ou as Setas do teclado para caminhar pelo acampamento.</span>
        </div>
      </div>
    </div>
  );
};
