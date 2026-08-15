import React from 'react';
import { Friend } from '../../types/friend.types';
import { useUIStore } from '../../stores/uiStore';
import { useCallStore } from '../../stores/callStore';
import { useFriendStore } from '../../stores/friendStore';
import { CanvasAvatarRenderer } from '../../components/avatar/CanvasAvatarRenderer';
import { VoxelBadge } from '../../components/ui/VoxelBadge';
import { MessageSquare, PhoneCall } from 'lucide-react';

interface FriendItemProps {
  friend: Friend;
}

export const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const { openContextMenu } = useUIStore();
  const { joinRoom } = useCallStore();
  const { setActiveDm } = useFriendStore();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, friend.id, friend.username);
  };

  const getStatusColor = () => {
    switch (friend.status) {
      case 'online':
        return 'bg-[#55FF55] shadow-[0_0_8px_rgba(85,255,85,0.6)]';
      case 'in_game':
        return 'bg-[#B565D8] shadow-[0_0_8px_rgba(181,101,216,0.6)]';
      case 'idle':
        return 'bg-[#FFAA00]';
      case 'offline':
      default:
        return 'bg-[#646A7E]';
    }
  };

  const getStatusLabel = () => {
    switch (friend.status) {
      case 'online':
        return 'Online';
      case 'in_game':
        return 'Jogando';
      case 'idle':
        return 'Ausente';
      case 'offline':
      default:
        return 'Offline';
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex items-center justify-between p-2.5 rounded-lg bg-[#14161C] hover:bg-[#1A1D26] border border-[#222634] hover:border-[#2E3547] transition-all duration-150 group cursor-pointer"
    >
      {/* Informações do Amigo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <CanvasAvatarRenderer avatarConfig={friend.avatarConfig} size={42} />
          {/* Status Dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#14161C] ${getStatusColor()}`}
            title={getStatusLabel()}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-[#F0F2F8] truncate">
              {friend.customNickname || friend.username}
            </span>
            {friend.customNickname && (
              <span className="text-[11px] text-[#9DA3B4] font-mono">
                ({friend.username})
              </span>
            )}
            <span className="text-xs text-[#646A7E] font-mono">
              #{friend.discriminator}
            </span>
          </div>

          {/* Atividade de Jogo / Bioma */}
          {friend.activity ? (
            <div className="text-xs text-[#9DA3B4] flex items-center gap-1 truncate mt-0.5">
              <span className="text-[#55FF55]">🎮 {friend.activity.gameName}</span>
              <span className="text-[#646A7E]">•</span>
              <span className="truncate">{friend.activity.details}</span>
            </div>
          ) : (
            <p className="text-xs text-[#646A7E] capitalize mt-0.5">{getStatusLabel()}</p>
          )}
        </div>
      </div>

      {/* Ações Rápidas (DM e Chamada) */}
      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDm(friend.id);
          }}
          className="p-2 rounded bg-[#1E222D] hover:bg-[#282E3E] text-[#9DA3B4] hover:text-white border border-[#2B3142] transition-colors cursor-pointer"
          title="Abrir Mensagem Direta"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            joinRoom(`p2p-${friend.id}`, `Chamada com ${friend.username}`, 'p2p');
          }}
          className="p-2 rounded bg-[#153D22] hover:bg-[#1C522D] text-[#55FF55] border border-[#228844] transition-colors cursor-pointer"
          title="Iniciar Chamada P2P Direta"
        >
          <PhoneCall className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
