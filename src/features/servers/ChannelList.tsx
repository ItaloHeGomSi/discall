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
    const name = prompt(`Digite o nome da nova sala de ${type === 'text' ? 'texto' : 'voz'}:`);
    if (name && name.trim()) {
      createChannel(server.id, name.trim(), type);
    }
  };

  return (
    <div className="w-60 bg-[#0E1015] border-r border-[#22262F] flex flex-col h-full shrink-0 select-none">
      {/* Nome do Grupo */}
      <div className="h-14 border-b border-[#22262F] px-4 flex items-center justify-between bg-[#12151C]">
        <h2 className="font-semibold text-sm text-[#F1F3F8] truncate">{server.name}</h2>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-5">
        {/* Seção: Salas de Texto */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-[#626B7A] tracking-wider mb-1.5 px-1">
            <span>Salas de Texto</span>
            <button
              onClick={() => handleAddChannel('text')}
              className="p-1 hover:text-[#5B7CFA] transition-colors cursor-pointer"
              title="Adicionar Sala de Texto"
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
                      ? 'bg-[#1B2340] text-[#93A6FF]'
                      : 'text-[#9AA3B2] hover:bg-[#161A22] hover:text-[#E2E4EB]'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 text-[#626B7A]" />
                  <span className="truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seção: Salas de Voz */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-[#626B7A] tracking-wider mb-1.5 px-1">
            <span>Salas de Voz</span>
            <button
              onClick={() => handleAddChannel('voice')}
              className="p-1 hover:text-[#5B7CFA] transition-colors cursor-pointer"
              title="Adicionar Sala de Voz"
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
                        ? 'bg-[#12321F] text-[#5EDB8F] border border-[#1F6A3D]'
                        : 'text-[#9AA3B2] hover:bg-[#161A22] hover:text-[#E2E4EB]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Volume2
                        className={`w-3.5 h-3.5 ${
                          isCurrentVoice ? 'text-[#5EDB8F] animate-pulse' : 'text-[#626B7A]'
                        }`}
                      />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {isCurrentVoice && (
                      <span className="text-[10px] text-[#5EDB8F] bg-[#0B0D12] px-1 rounded">
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
