import React, { useState } from 'react';
import { useCallStore } from '../../stores/callStore';
import { useClipRecorder } from '../clips/useClipRecorder';
import { ReactionPicker } from './ReactionPicker';
import { VoxelButton } from '../../components/ui/VoxelButton';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  StopCircle,
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

  const handleDisconnect = () => {
    // Toca som de teleporte do Enderman ao desconectar
    const audio = new Audio('/assets/audio/teleport.ogg');
    audio.volume = 0.4;
    audio.play().catch(() => {});
    leaveRoom();
  };

  return (
    <div className="h-16 bg-[#111318] border-t border-[#222634] px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Controles de Entrada (Mic / Deafen / Câmera) */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleAudio}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isAudioMuted
              ? 'bg-[#3D1515] border-[#882222] text-[#FF5555] shadow-[0_0_8px_rgba(255,85,85,0.3)]'
              : 'bg-[#1E222D] hover:bg-[#282E3E] border-[#2B3142] text-[#55FF55]'
          }`}
          title={isAudioMuted ? 'Ativar Microfone' : 'Silenciar Microfone'}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleDeafen}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isDeafened
              ? 'bg-[#3D1515] border-[#882222] text-[#FF5555]'
              : 'bg-[#1E222D] hover:bg-[#282E3E] border-[#2B3142] text-[#9DA3B4] hover:text-white'
          }`}
          title={isDeafened ? 'Desensurdecer Áudio' : 'Ensurdecer (Muta tudo)'}
        >
          <Headphones className="w-5 h-5" />
        </button>

        <button
          onClick={toggleVideo}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            isVideoMuted
              ? 'bg-[#1E222D] border-[#2B3142] text-[#9DA3B4] hover:text-white'
              : 'bg-[#153D22] border-[#228844] text-[#55FF55]'
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
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer ${
            isScreenSharing
              ? 'bg-[#153A3D] border-[#55FFFF] text-[#55FFFF] shadow-[0_0_10px_rgba(85,255,255,0.3)]'
              : 'bg-[#1E222D] hover:bg-[#282E3E] border-[#2B3142] text-[#E2E4EB]'
          }`}
        >
          <ScreenShare className="w-4 h-4" />
          <span>{isScreenSharing ? 'PARAR TELA' : 'COMPARTILHAR TELA'}</span>
        </button>

        {/* Gravar Clipe em Disco */}
        <button
          onClick={handleToggleRecord}
          className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer ${
            isRecording
              ? 'bg-[#FF5555] border-[#FF7777] text-[#0C0D10] animate-pulse shadow-[0_0_12px_rgba(255,85,85,0.6)]'
              : 'bg-[#1E222D] hover:bg-[#282E3E] border-[#2B3142] text-[#FF5555]'
          }`}
          title="Gravar Clipe (Salva direto no disco via Tauri FS)"
        >
          <Disc className="w-4 h-4" />
          <span>{isRecording ? 'GRAVANDO CLIPE...' : 'CLIPE'}</span>
        </button>

        {/* Reações de Emojis */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
              showReactionPicker
                ? 'bg-[#1E222D] border-[#FFAA00] text-[#FFAA00]'
                : 'bg-[#1E222D] hover:bg-[#282E3E] border-[#2B3142] text-[#9DA3B4] hover:text-white'
            }`}
            title="Enviar Reação Rápida Minecraft"
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
              ? 'bg-[#1E222D] border-[#55FF55] text-[#55FF55]'
              : 'bg-[#1E222D] hover:bg-[#282E3E] border-[#2B3142] text-[#9DA3B4] hover:text-white'
          }`}
          title="Alternar Chat Lateral"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <VoxelButton
          variant="danger"
          size="md"
          onClick={handleDisconnect}
          className="font-mono tracking-wider text-xs px-4"
        >
          <PhoneOff className="w-4 h-4 mr-1" />
          DESCONECTAR
        </VoxelButton>
      </div>
    </div>
  );
};
