import React from 'react';
import { Friend } from '../../types/friend.types';
import { useUIStore } from '../../stores/uiStore';
import { useCallStore } from '../../stores/callStore';
import { useFriendStore } from '../../stores/friendStore';
import { Avatar } from '../../components/ui/Avatar';
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
        return 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]';
      case 'busy':
        return 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'away':
        return 'bg-[#F59E0B]';
      case 'offline':
      default:
        return 'bg-[#626B7A]';
    }
  };

  const getStatusLabel = () => {
    switch (friend.status) {
      case 'online':
        return 'Online';
      case 'busy':
        return 'Ocupado';
      case 'away':
        return 'Ausente';
      case 'offline':
      default:
        return 'Offline';
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex items-center justify-between p-2.5 rounded-lg bg-[#12151C] hover:bg-[#161A22] border border-[#22262F] hover:border-[#333A48] transition-all duration-150 group cursor-pointer"
    >
      {/* Informações do Contato */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <Avatar username={friend.username} avatarColor={friend.avatarColor} avatarUrl={friend.avatarUrl} size={42} />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#12151C] ${getStatusColor()}`}
            title={getStatusLabel()}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-[#F1F3F8] truncate">
              {friend.customNickname || friend.username}
            </span>
            {friend.customNickname && (
              <span className="text-[11px] text-[#9AA3B2]">
                ({friend.username})
              </span>
            )}
          </div>

          {friend.statusMessage ? (
            <p className="text-xs text-[#9AA3B2] truncate mt-0.5">{friend.statusMessage}</p>
          ) : (
            <p className="text-xs text-[#626B7A] mt-0.5">{getStatusLabel()}</p>
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
          className="p-2 rounded bg-[#1B1F29] hover:bg-[#262C3A] text-[#9AA3B2] hover:text-white border border-[#333A48] transition-colors cursor-pointer"
          title="Abrir Mensagem Direta"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            joinRoom(`p2p-${friend.id}`, `Chamada com ${friend.username}`, 'p2p');
          }}
          className="p-2 rounded bg-[#12321F] hover:bg-[#164A2C] text-[#5EDB8F] border border-[#1F6A3D] transition-colors cursor-pointer"
          title="Iniciar Chamada Direta"
        >
          <PhoneCall className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
