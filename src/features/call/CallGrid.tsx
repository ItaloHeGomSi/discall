import React from 'react';
import { useCallStore } from '../../stores/callStore';
import { ParticipantCard } from './ParticipantCard';
import { CallControlsBottomBar } from './CallControlsBottomBar';
import { CallSideChat } from './CallSideChat';
import { ScreenShare } from 'lucide-react';

export const CallGrid: React.FC = () => {
  const { participants, isChatOpen, isScreenSharing } = useCallStore();

  const participantList = Object.values(participants);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A0D] overflow-hidden">
      {/* Área Central: Grid de Vídeos e Chat Lateral */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 flex flex-col items-center justify-center overflow-y-auto">
          {/* Se a tela estiver sendo compartilhada, exibe o viewport da tela */}
          {isScreenSharing && (
            <div className="w-full max-w-4xl bg-[#14161C] border border-[#55FFFF]/40 rounded-xl mb-4 p-4 flex flex-col items-center justify-center aspect-video relative shadow-2xl">
              <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-mono text-[#55FFFF] flex items-center gap-1.5">
                <ScreenShare className="w-3.5 h-3.5 animate-pulse" />
                <span>SteveMiner - Tela Compartilhada (1080p60)</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center text-[#9DA3B4]">
                <div className="w-16 h-16 rounded-full bg-[#153A3D] flex items-center justify-center text-2xl mb-2 border border-[#55FFFF]">
                  🖥️
                </div>
                <p className="text-sm font-semibold text-[#F0F2F8]">
                  Transmissão de Área de Trabalho Ativa
                </p>
                <p className="text-xs text-[#646A7E] mt-1 font-mono">
                  Captura com áudio isolado e taxa de quadros de alta performance
                </p>
              </div>
            </div>
          )}

          {/* Grid de Participantes */}
          <div
            className={`w-full grid gap-4 max-w-6xl ${
              participantList.length === 1
                ? 'grid-cols-1 max-w-xl'
                : participantList.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {participantList.map((p) => (
              <ParticipantCard key={p.id} participant={p} />
            ))}
          </div>
        </div>

        {/* Chat Lateral da Chamada (Gaveta) */}
        {isChatOpen && <CallSideChat />}
      </div>

      {/* Barra Inferior de Controles */}
      <CallControlsBottomBar />
    </div>
  );
};
