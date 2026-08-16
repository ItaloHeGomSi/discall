import React from 'react';
import { useCallStore } from '../../stores/callStore';
import { LOCAL_USER_ID } from '../../constants';

interface ReactionPickerProps {
  onClose: () => void;
}

const QUICK_REACTIONS = [
  { emoji: '👍', label: 'Concordo' },
  { emoji: '❤️', label: 'Adorei' },
  { emoji: '😂', label: 'Engraçado' },
  { emoji: '👏', label: 'Aplausos' },
  { emoji: '🎉', label: 'Comemoração' },
  { emoji: '🤝', label: 'Combinado' },
  { emoji: '👀', label: 'Vendo' },
  { emoji: '✅', label: 'Feito' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onClose }) => {
  const { triggerReaction } = useCallStore();

  const handleSelect = (emoji: string) => {
    triggerReaction(LOCAL_USER_ID, emoji);
    onClose();
  };

  return (
    <div className="absolute bottom-full mb-2 bg-[#12151C] border border-[#22262F] rounded-lg shadow-2xl p-2 z-50 flex items-center gap-1.5">
      {QUICK_REACTIONS.map((item) => (
        <button
          key={item.emoji}
          onClick={() => handleSelect(item.emoji)}
          className="w-8 h-8 rounded hover:bg-[#1B1F29] hover:scale-125 flex items-center justify-center text-lg transition-all duration-150 cursor-pointer"
          title={item.label}
        >
          {item.emoji}
        </button>
      ))}
    </div>
  );
};
