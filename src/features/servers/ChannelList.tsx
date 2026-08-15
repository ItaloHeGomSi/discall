import React from 'react';
import { Server, ServerChannel } from '../../types/server.types';
import { useServerStore } from '../../stores/serverStore';
import { useCallStore } from '../../stores/callStore';
import { Hash, Volume2, Plus } from 'lucide-react';

interface ChannelListProps {
  server: Server;
}

export const ChannelList: React.FC<ChannelListProps> = ({ server }) => {
  const { activeChannelId, setActiveChannel, createChannel } = useServerStore();
  const { joinRoom, activeRoomId, isInCall } = useCallStore();

  const textChannels = server.channels.filter((c) => c.type === 'text');
  const voiceChannels = server.channels.filter((c) => c.type === 'voice');

  const handleChannelClick = (channel: ServerChannel) => {
    if (channel.type === 'text') {
      setActiveChannel(channel.id);
    } else if (channel.type === 'voice') {
      joinRoom(channel.id, `${server.name} › ${channel.name}`, 'server');
    }
  };

  const handleAddChannel = (type: 'text' | 'voice') => {
    const name = prompt(`Digite o nome do novo canal de ${type === 'text' ? 'texto' : 'voz'}:`);
    if (name && name.trim()) {
      createChannel(server.id, name.trim(), type);
    }
  };

  return (
    <div className="w-60 bg-[#0E1015]/75 backdrop-blur-xs border-r border-[#222634]/70 flex flex-col h-full shrink-0 select-none">
      {/* Nome do Servidor */}
      <div className="h-14 border-b border-[#222634]/70 px-4 flex items-center justify-between bg-[#14161C]/75">
        <h2 className="font-semibold text-sm text-[#F0F2F8] truncate flex items-center gap-1.5">
          <span className="text-[#55FF55]">⚔️</span> {server.name}
        </h2>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-5">
        {/* Seção: Canais de Texto */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-[#646A7E] tracking-wider mb-1.5 px-1">
            <span>Canais de Texto</span>
            <button
              onClick={() => handleAddChannel('text')}
              className="p-1 hover:text-[#55FF55] transition-colors cursor-pointer"
              title="Adicionar Canal de Texto"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {textChannels.map((ch) => {
              const isActive = activeChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChannelClick(ch)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#1E222D]/90 text-[#55FF55] border border-[#55FF55]/40'
                      : 'text-[#9DA3B4] hover:bg-[#1A1D26]/80 hover:text-[#E2E4EB]'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 text-[#646A7E]" />
                  <span className="truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seção: Canais de Voz */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-[#646A7E] tracking-wider mb-1.5 px-1">
            <span>Canais de Voz</span>
            <button
              onClick={() => handleAddChannel('voice')}
              className="p-1 hover:text-[#55FF55] transition-colors cursor-pointer"
              title="Adicionar Canal de Voz"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {voiceChannels.map((ch) => {
              const isCurrentVoice = isInCall && activeRoomId === ch.id;
              return (
                <div key={ch.id} className="space-y-1">
                  <button
                    onClick={() => handleChannelClick(ch)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      isCurrentVoice
                        ? 'bg-[#153D22]/90 text-[#55FF55] border border-[#228844]'
                        : 'text-[#9DA3B4] hover:bg-[#1A1D26]/80 hover:text-[#E2E4EB]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Volume2
                        className={`w-3.5 h-3.5 ${
                          isCurrentVoice ? 'text-[#55FF55] animate-pulse' : 'text-[#646A7E]'
                        }`}
                      />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {isCurrentVoice && (
                      <span className="text-[10px] font-mono text-[#55FF55] bg-[#0C0D10] px-1 rounded">
                        CONECTADO
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
