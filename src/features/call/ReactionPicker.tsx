import React from 'react';
import { useCallStore } from '../../stores/callStore';

interface ReactionPickerProps {
  onClose: () => void;
}

const MINECRAFT_REACTIONS = [
  { emoji: '💎', label: 'Diamante' },
  { emoji: '🔥', label: 'Fogo / Nether' },
  { emoji: '🥩', label: 'Bife Assado' },
  { emoji: '💀', label: 'Caveira Wither' },
  { emoji: '❤️', label: 'Coração Hardcore' },
  { emoji: '⭐', label: 'Nether Star' },
  { emoji: '⚔️', label: 'Espada de Diamante' },
  { emoji: '⛏️', label: 'Picareta' },
  { emoji: '🍞', label: 'Pão da Vila' },
  { emoji: '🏹', label: 'Arco e Flecha' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onClose }) => {
  const { triggerReaction } = useCallStore();

  const handleSelect = (emoji: string) => {
    triggerReaction('local-steve-1234', emoji);
    onClose();
  };

  return (
    <div className="absolute bottom-full mb-2 bg-[#14161C] border border-[#2B3142] rounded-lg shadow-2xl p-2 z-50 flex items-center gap-1.5 animate-in fade-in zoom-in-95">
      {MINECRAFT_REACTIONS.map((item) => (
        <button
          key={item.emoji}
          onClick={() => handleSelect(item.emoji)}
          className="w-8 h-8 rounded hover:bg-[#1E222D] hover:scale-125 flex items-center justify-center text-lg transition-all duration-150 cursor-pointer"
          title={item.label}
        >
          {item.emoji}
        </button>
      ))}
    </div>
  );
};
