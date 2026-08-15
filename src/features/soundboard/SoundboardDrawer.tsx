import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Volume2, X, Sparkles, Flame, Skull, Music } from 'lucide-react';

interface SoundEffect {
  id: string;
  name: string;
  emoji: string;
  hotkey: string;
  description: string;
}

const SOUNDS: SoundEffect[] = [
  { id: 'levelup', name: 'Nível de XP', emoji: '✨', hotkey: 'F1', description: 'Som de conquista de experiência' },
  { id: 'villager', name: 'Aldeão "Hrrr"', emoji: '🧑‍🌾', hotkey: 'F2', description: 'Troca de itens com o aldeão' },
  { id: 'creeper', name: 'Creeper "Tssss"', emoji: '💣', hotkey: 'F3', description: 'Alerta de explosão iminente' },
  { id: 'cave', name: 'Som de Caverna', emoji: '🦇', hotkey: 'F4', description: 'Efeito sonoro ambiente misterioso' },
  { id: 'anvil', name: 'Queda de Bigorna', emoji: '🔨', hotkey: 'F5', description: 'Impacto pesado de metal' },
  { id: 'portal', name: 'Portal do Nether', emoji: '🌀', hotkey: 'F6', description: 'Ressonância dimensional' },
  { id: 'eat', name: 'Comendo Bife', emoji: '🥩', hotkey: 'F7', description: 'Mastigação rápida de alimento' },
  { id: 'totem', name: 'Totem Salvando', emoji: '🗿', hotkey: 'F8', description: 'Ressurreição mística' },
];

export const SoundboardDrawer: React.FC = () => {
  const { isSoundboardOpen, setSoundboardOpen } = useUIStore();

  const playSound = (soundId: string) => {
    // Sintetizador Web Audio API para tocar sons caso o arquivo de áudio estático não exista localmente
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (soundId === 'levelup') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      } else if (soundId === 'creeper') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
      } else {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Sound played:', soundId);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mapping: Record<string, string> = {
        F1: 'levelup',
        F2: 'villager',
        F3: 'creeper',
        F4: 'cave',
        F5: 'anvil',
        F6: 'portal',
        F7: 'eat',
        F8: 'totem',
      };
      if (mapping[e.key]) {
        e.preventDefault();
        playSound(mapping[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isSoundboardOpen) return null;

  return (
    <div className="fixed bottom-18 right-6 w-80 bg-[#14161C] border border-[#2B3142] rounded-xl shadow-2xl z-40 overflow-hidden select-none animate-in fade-in slide-in-from-bottom-4 duration-150">
      {/* Header */}
      <div className="p-3.5 bg-[#1A1D26] border-b border-[#222634] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#55FFFF]" />
          <h3 className="font-semibold text-xs text-[#F0F2F8] uppercase font-mono tracking-wider">
            Minecraft Soundboard
          </h3>
        </div>
        <button
          onClick={() => setSoundboardOpen(false)}
          className="p-1 text-[#9DA3B4] hover:text-white rounded cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid de Efeitos */}
      <div className="p-3 grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
        {SOUNDS.map((s) => (
          <button
            key={s.id}
            onClick={() => playSound(s.id)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#1E222D] hover:bg-[#282E3E] border border-[#2B3142] hover:border-[#55FFFF]/40 text-left transition-all active:scale-95 cursor-pointer group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              {s.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#E2E4EB] truncate">
                  {s.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#55FF55] bg-[#0C0D10] px-1 rounded">
                {s.hotkey}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="px-3 py-2 bg-[#0C0D10] border-t border-[#222634] text-[10px] font-mono text-[#646A7E] text-center">
        Pressione as teclas F1 a F8 a qualquer momento para tocar
      </div>
    </div>
  );
};
