import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCallStore } from '../../stores/callStore';
import { useUIStore } from '../../stores/uiStore';
import { Avatar } from '../ui/Avatar';
import { Settings, Minus, Square, X } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user } = useAuthStore();
  const { isInCall, roomName, leaveRoom } = useCallStore();
  const { setProfileModalOpen, setDeviceSettingsOpen } = useUIStore();

  const handleWindowAction = async (action: 'minimize' | 'maximize' | 'close') => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      if (action === 'minimize') await appWindow.minimize();
      if (action === 'maximize') await appWindow.toggleMaximize();
      if (action === 'close') await appWindow.close();
    } catch {
      console.log(`Window action: ${action}`);
    }
  };

  return (
    <header
      data-tauri-drag-region
      className="h-10 bg-[#0B0D12]/95 border-b border-[#22262F] flex items-center justify-between px-3 select-none z-30"
    >
      {/* Marca / Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-5 h-5 bg-[#3B4A8C] border border-[#5B7CFA] rounded-md flex items-center justify-center font-bold text-xs text-white">
            D
          </div>
          <span className="text-xs font-semibold tracking-wide text-[#F1F3F8]">Discall</span>
        </div>

        {/* Indicador de Chamada Ativa no TopBar */}
        {isInCall && (
          <div className="flex items-center gap-2 pl-3 border-l border-[#22262F]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#12321F] border border-[#1F6A3D] rounded text-xs text-[#5EDB8F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="truncate max-w-[140px]">{roomName}</span>
            </div>
            <button
              onClick={leaveRoom}
              className="text-[11px] text-[#EF4444] hover:underline cursor-pointer"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {/* Lado Direito: Perfil do Usuário, Configurações e Controles de Janela */}
      <div className="flex items-center gap-2">
        {/* Perfil */}
        {user && (
          <div
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2 px-2 py-1 bg-[#12151C] hover:bg-[#1B1F29] border border-[#22262F] rounded-md cursor-pointer transition-colors"
            title="Ver e editar seu perfil"
          >
            <Avatar username={user.username} avatarColor={user.avatarColor} avatarUrl={user.avatarUrl} size={22} />
            <span className="text-xs font-medium text-[#F1F3F8] hidden sm:inline">
              {user.username}
            </span>
          </div>
        )}

        {/* Configurações de Hardware */}
        <button
          onClick={() => setDeviceSettingsOpen(true)}
          className="p-1.5 text-[#9AA3B2] hover:text-white hover:bg-[#1B1F29] rounded transition-colors cursor-pointer"
          title="Configurações de Áudio e Vídeo"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Controles Nativos de Janela (Tauri) */}
        <div className="flex items-center ml-2 border-l border-[#22262F] pl-2 gap-1">
          <button
            onClick={() => handleWindowAction('minimize')}
            className="p-1 text-[#9AA3B2] hover:text-white hover:bg-[#1B1F29] rounded cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleWindowAction('maximize')}
            className="p-1 text-[#9AA3B2] hover:text-white hover:bg-[#1B1F29] rounded cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleWindowAction('close')}
            className="p-1 text-[#9AA3B2] hover:text-[#EF4444] hover:bg-[#3A1616] rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
