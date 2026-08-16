import React, { useState } from 'react';
import { useCallStore } from '../../stores/callStore';
import { useClipRecorder } from '../clips/useClipRecorder';
import { ReactionPicker } from './ReactionPicker';
import { Button } from '../../components/ui/Button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  MessageSquare,
  Smile,
  Disc,
  Headphones,
} from 'lucide-react';

export const CallControlsBottomBar: React.FC = () => {
  const {
    isAudioMuted,
    isVideoMuted,
    isDeafened,
    isScreenSharing,
    isChatOpen,
    toggleAudio,
    toggleVideo,
    toggleDeafen,
    toggleScreenShare,
    toggleChat,
    leaveRoom,
  } = useCallStore();

  const { isRecording, startRecording, stopRecording } = useClipRecorder();
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="h-16 bg-[#111318] border-t border-[#22262F] px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Controles de Entrada (Mic / Deafen / Câmera) */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleAudio}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isAudioMuted
              ? 'bg-[#3A1616] border-[#7A2A2A] text-[#EF4444]'
              : 'bg-[#1B1F29] hover:bg-[#262C3A] border-[#333A48] text-[#5EDB8F]'
          }`}
          title={isAudioMuted ? 'Ativar Microfone' : 'Silenciar Microfone'}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleDeafen}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isDeafened
              ? 'bg-[#3A1616] border-[#7A2A2A] text-[#EF4444]'
              : 'bg-[#1B1F29] hover:bg-[#262C3A] border-[#333A48] text-[#9AA3B2] hover:text-white'
          }`}
          title={isDeafened ? 'Reativar Áudio' : 'Silenciar tudo'}
        >
          <Headphones className="w-5 h-5" />
        </button>

        <button
          onClick={toggleVideo}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isVideoMuted
              ? 'bg-[#1B1F29] border-[#333A48] text-[#9AA3B2] hover:text-white'
              : 'bg-[#12321F] border-[#1F6A3D] text-[#5EDB8F]'
          }`}
          title={isVideoMuted ? 'Ligar Câmera' : 'Desligar Câmera'}
        >
          {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>
      </div>

      {/* Controles de Transmissão e Interatividade (Centro) */}
      <div className="flex items-center gap-3">
        {/* Compartilhar Tela */}
        <button
          onClick={toggleScreenShare}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-xs font-semibold tracking-wider transition-all duration-150 cursor-pointer ${
            isScreenSharing
              ? 'bg-[#1B2340] border-[#5B7CFA] text-[#93A6FF]'
              : 'bg-[#1B1F29] hover:bg-[#262C3A] border-[#333A48] text-[#E2E4EB]'
          }`}
        >
          <ScreenShare className="w-4 h-4" />
          <span>{isScreenSharing ? 'PARAR TELA' : 'COMPARTILHAR TELA'}</span>
        </button>

        {/* Gravar Reunião em Disco */}
        <button
          onClick={handleToggleRecord}
          className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-xs font-semibold tracking-wider transition-all duration-150 cursor-pointer ${
            isRecording
              ? 'bg-[#EF4444] border-[#F16565] text-white animate-pulse'
              : 'bg-[#1B1F29] hover:bg-[#262C3A] border-[#333A48] text-[#EF4444]'
          }`}
          title="Gravar reunião (salva localmente)"
        >
          <Disc className="w-4 h-4" />
          <span>{isRecording ? 'GRAVANDO...' : 'GRAVAR'}</span>
        </button>

        {/* Reações Rápidas */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
              showReactionPicker
                ? 'bg-[#1B1F29] border-[#F59E0B] text-[#F59E0B]'
                : 'bg-[#1B1F29] hover:bg-[#262C3A] border-[#333A48] text-[#9AA3B2] hover:text-white'
            }`}
            title="Enviar Reação Rápida"
          >
            <Smile className="w-5 h-5" />
          </button>
          {showReactionPicker && (
            <ReactionPicker onClose={() => setShowReactionPicker(false)} />
          )}
        </div>
      </div>

      {/* Lado Direito: Chat Lateral e Desconexão */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleChat}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isChatOpen
              ? 'bg-[#1B1F29] border-[#5B7CFA] text-[#93A6FF]'
              : 'bg-[#1B1F29] hover:bg-[#262C3A] border-[#333A48] text-[#9AA3B2] hover:text-white'
          }`}
          title="Alternar Chat Lateral"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <Button
          variant="danger"
          size="md"
          onClick={leaveRoom}
          className="tracking-wider text-xs px-4"
        >
          <PhoneOff className="w-4 h-4 mr-1" />
          DESCONECTAR
        </Button>
      </div>
    </div>
  );
};
