import React, { useState } from 'react';
import { CallParticipant } from '../../types/call.types';
import { useCallStore } from '../../stores/callStore';
import { AvatarFlipCard } from '../../components/avatar/AvatarFlipCard';
import { MicOff, Volume2, Shield, MoreVertical } from 'lucide-react';

interface ParticipantCardProps {
  participant: CallParticipant;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
  const { setParticipantVolume } = useCallStore();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const isLocal = participant.id === 'local-steve-1234';

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-[#14161C] border border-[#222634] rounded-xl shadow-lg aspect-video min-h-[160px] overflow-hidden group">
      {/* Reação de Emoji Flutuante */}
      {participant.activeReaction && (
        <div
          key={participant.activeReaction.id}
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-float-reaction pointer-events-none"
        >
          {participant.activeReaction.emoji}
        </div>
      )}

      {/* Avatar Central com Suporte a Duplo Clique 3D Flip */}
      <div className="flex flex-col items-center justify-center gap-2 z-10">
        <AvatarFlipCard
          avatarConfig={participant.avatarConfig}
          realPhotoUrl={participant.realPhotoUrl}
          isSpeaking={participant.isSpeaking}
          dimensionTheme={participant.dimensionTheme}
          size={84}
        />
      </div>

      {/* Nome e Indicadores Inferiores */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded text-xs font-medium text-[#F0F2F8] max-w-[70%] truncate">
          <span className="truncate">{participant.username}</span>
          {isLocal && <span className="text-[#55FF55] font-mono text-[10px]">(Você)</span>}
        </div>

        <div className="flex items-center gap-1">
          {participant.isAudioMuted && (
            <div
              className="p-1 rounded bg-[#3D1515] text-[#FF5555] border border-[#882222]"
              title="Microfone Desativado"
            >
              <MicOff className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Ajuste Individual de Volume (se não for o próprio usuário) */}
          {!isLocal && (
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="p-1 rounded bg-black/60 hover:bg-[#1E222D] text-[#9DA3B4] hover:text-white transition-colors cursor-pointer"
                title={`Ajustar Volume (${participant.volume}%)`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#14161C] border border-[#2B3142] rounded-lg shadow-xl flex items-center gap-2 z-30 w-36">
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={participant.volume}
                    onChange={(e) =>
                      setParticipantVolume(participant.id, Number(e.target.value))
                    }
                    className="w-full accent-[#55FF55] cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-[#55FF55] w-8">
                    {participant.volume}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
