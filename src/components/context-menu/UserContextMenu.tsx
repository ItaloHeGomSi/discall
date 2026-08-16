import React, { useEffect, useRef, useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useFriendStore } from '../../stores/friendStore';
import { useCallStore } from '../../stores/callStore';
import { useServerStore } from '../../stores/serverStore';
import {
  User,
  MessageSquare,
  PhoneCall,
  Edit3,
  UserMinus,
  ShieldAlert,
  Send,
  Check,
  X
} from 'lucide-react';

export const UserContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu, setProfileModalOpen } = useUIStore();
  const { friends, setCustomNickname, removeFriend, blockUser, unblockUser, setActiveDm } = useFriendStore();
  const { joinRoom } = useCallStore();
  const { servers } = useServerStore();

  const [isEditingNick, setIsEditingNick] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [showServerSubmenu, setShowServerSubmenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const friend = contextMenu.targetUserId ? friends[contextMenu.targetUserId] : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
        setIsEditingNick(false);
      }
    };
    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen || !contextMenu.targetUserId) return null;

  // Ajuste de posição para não sair da tela
  const posX = Math.min(contextMenu.x, window.innerWidth - 240);
  const posY = Math.min(contextMenu.y, window.innerHeight - 320);

  const handleOpenDM = () => {
    if (contextMenu.targetUserId) {
      setActiveDm(contextMenu.targetUserId);
      closeContextMenu();
    }
  };

  const handleStartCall = () => {
    if (contextMenu.targetUserId && contextMenu.targetUsername) {
      joinRoom(`p2p-${contextMenu.targetUserId}`, `Chamada com ${contextMenu.targetUsername}`, 'p2p');
      closeContextMenu();
    }
  };

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (contextMenu.targetUserId) {
      setCustomNickname(contextMenu.targetUserId, nicknameInput);
      setIsEditingNick(false);
      closeContextMenu();
    }
  };

  const handleRemoveFriend = () => {
    if (contextMenu.targetUserId) {
      removeFriend(contextMenu.targetUserId);
      closeContextMenu();
    }
  };

  const handleToggleBlock = () => {
    if (contextMenu.targetUserId) {
      if (friend?.isBlocked) {
        unblockUser(contextMenu.targetUserId);
      } else {
        blockUser(contextMenu.targetUserId);
      }
      closeContextMenu();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-56 bg-[#12151C] border border-[#22262F] rounded-lg shadow-2xl py-1 text-sm text-[#E2E4EB] select-none"
      style={{ top: posY, left: posX }}
    >
      {/* Cabeçalho do Menu */}
      <div className="px-3 py-1.5 border-b border-[#22262F] text-xs font-semibold text-[#9AA3B2] flex items-center justify-between">
        <span className="truncate">{contextMenu.targetUsername}</span>
        {friend?.customNickname && (
          <span className="text-[10px] text-[#93A6FF]">({friend.customNickname})</span>
        )}
      </div>

      {/* Opções */}
      {!isEditingNick ? (
        <div className="py-1">
          <button
            onClick={() => {
              setProfileModalOpen(true);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#1B1F29] hover:text-[#93A6FF] text-left transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-[#9AA3B2]" />
            <span>Ver Perfil</span>
          </button>

          <button
            onClick={handleOpenDM}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#1B1F29] hover:text-[#93A6FF] text-left transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#9AA3B2]" />
            <span>Chat Privado (DM)</span>
          </button>

          <button
            onClick={handleStartCall}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#1B1F29] hover:text-[#5EDB8F] text-left transition-colors cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#5EDB8F] font-medium">Chamada Direta</span>
          </button>

          <button
            onClick={() => {
              setNicknameInput(friend?.customNickname || '');
              setIsEditingNick(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#1B1F29] text-left transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#9AA3B2]" />
            <span>Definir Apelido Local</span>
          </button>

          <div
            className="relative"
            onMouseEnter={() => setShowServerSubmenu(true)}
            onMouseLeave={() => setShowServerSubmenu(false)}
          >
            <button className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#1B1F29] text-left transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-[#9AA3B2]" />
                <span>Convidar p/ Grupo</span>
              </div>
              <span className="text-xs text-[#9AA3B2]">›</span>
            </button>

            {/* Submenu de Grupos */}
            {showServerSubmenu && (
              <div className="absolute left-full top-0 ml-1 w-48 bg-[#12151C] border border-[#22262F] rounded-lg shadow-2xl py-1">
                {Object.values(servers).map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => {
                      alert(`Convite para "${srv.name}" enviado com sucesso!`);
                      closeContextMenu();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#1B1F29] hover:text-[#93A6FF] truncate cursor-pointer"
                  >
                    {srv.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="my-1 border-t border-[#22262F]" />

          <button
            onClick={handleRemoveFriend}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#3A1616] text-[#EF4444] text-left transition-colors cursor-pointer"
          >
            <UserMinus className="w-4 h-4" />
            <span>Remover Contato</span>
          </button>

          <button
            onClick={handleToggleBlock}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#3A1616] text-[#EF4444] text-left transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{friend?.isBlocked ? 'Desbloquear Usuário' : 'Bloquear Usuário'}</span>
          </button>
        </div>
      ) : (
        /* Formulário de Apelido */
        <form onSubmit={handleSaveNickname} className="p-3">
          <label className="block text-[11px] text-[#9AA3B2] mb-1 uppercase">
            Novo Apelido:
          </label>
          <input
            type="text"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            placeholder="Ex: Chefe"
            autoFocus
            className="w-full bg-[#0B0D12] border border-[#22262F] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#5B7CFA] mb-2"
          />
          <div className="flex gap-1 justify-end">
            <button
              type="button"
              onClick={() => setIsEditingNick(false)}
              className="p-1 hover:bg-[#1B1F29] rounded text-[#9AA3B2] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="p-1 bg-[#5B7CFA] hover:bg-[#7089FB] rounded text-white cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
