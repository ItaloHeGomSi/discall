import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCallStore } from '../../stores/callStore';
import { useUIStore } from '../../stores/uiStore';
import { CanvasAvatarRenderer } from '../avatar/CanvasAvatarRenderer';
import { VoxelBadge } from '../ui/VoxelBadge';
import { 
  Volume2, 
  Settings, 
  Sparkles, 
  Flame, 
  Minus, 
  Square, 
  X,
  Compass
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user } = useAuthStore();
  const { isInCall, roomName, leaveRoom, activeBiomeTheme, setBiomeTheme } = useCallStore();
  const { 
    setSkinEditorOpen, 
    setDeviceSettingsOpen, 
    isSoundboardOpen, 
    setSoundboardOpen 
  } = useUIStore();

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

  const getDimensionIcon = () => {
    switch (activeBiomeTheme) {
      case 'nether':
        return <Flame className="w-3 h-3 text-[#FF5555]" />;
      case 'the_end':
        return <Sparkles className="w-3 h-3 text-[#B565D8]" />;
      case 'deep_dark':
        return <div className="w-2 h-2 rounded-full bg-[#3A82FF] animate-pulse" />;
      case 'plains':
      default:
        return <Compass className="w-3 h-3 text-[#55FF55]" />;
    }
  };

  return (
    <header
      data-tauri-drag-region
      className="h-10 bg-[#0C0D10]/90 backdrop-blur-xs border-b border-[#222634]/80 flex items-center justify-between px-3 select-none z-30"
    >
      {/* Marca / Logo Discall com tema Minecraft */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-5 h-5 bg-[#228844] border border-[#55FF55] rounded-xs flex items-center justify-center font-mono font-bold text-xs text-white shadow-[0_0_8px_rgba(85,255,85,0.4)]">
            D
          </div>
          <span className="font-mono text-xs font-bold tracking-wider text-[#F0F2F8]">
            DISCALL <span className="text-[#55FF55]">VOXEL</span>
          </span>
        </div>

        {/* Indicador de Chamada Ativa no TopBar */}
        {isInCall && (
          <div className="flex items-center gap-2 pl-3 border-l border-[#222634]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#153D22] border border-[#228844] rounded text-xs text-[#55FF55] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55FF55] animate-ping" />
              <span className="truncate max-w-[140px]">{roomName}</span>
            </div>
            <button
              onClick={leaveRoom}
              className="text-[11px] text-[#FF5555] hover:underline font-mono cursor-pointer"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {/* Centro: Seletor Rápido de Bioma/Cenário */}
      <div className="hidden md:flex items-center gap-1 bg-[#14161C]/85 border border-[#222634] rounded-md px-1.5 py-0.5 shadow-sm">
        <span className="text-[10px] font-mono text-[#9DA3B4] flex items-center gap-1 pr-1">
          {getDimensionIcon()} Cenário:
        </span>
        {(['plains', 'nether', 'the_end', 'deep_dark'] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBiomeTheme(b)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all cursor-pointer capitalize ${
              activeBiomeTheme === b
                ? 'bg-[#1E222D] text-[#55FF55] font-bold border border-[#55FF55]/60 shadow-[0_0_8px_rgba(85,255,85,0.2)]'
                : 'text-[#9DA3B4] hover:text-white'
            }`}
          >
            {b.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Lado Direito: Soundboard, Perfil do Usuário, Configurações e Controles de Janela */}
      <div className="flex items-center gap-2">
        {/* Botão Soundboard */}
        <button
          onClick={() => setSoundboardOpen(!isSoundboardOpen)}
          className={`px-2 py-1 text-xs font-mono rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
            isSoundboardOpen
              ? 'bg-[#1E222D] border-[#55FFFF] text-[#55FFFF]'
              : 'bg-[#14161C]/80 border-[#222634] text-[#9DA3B4] hover:text-white'
          }`}
          title="Abrir Soundboard Minecraft (Atalhos F1-F8)"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Soundboard</span>
        </button>

        {/* Perfil & Skin */}
        {user && (
          <div
            onClick={() => setSkinEditorOpen(true)}
            className="flex items-center gap-2 px-2 py-1 bg-[#14161C]/80 hover:bg-[#1E222D] border border-[#222634] rounded cursor-pointer transition-colors"
            title="Clique para customizar sua Skin no Canvas"
          >
            <CanvasAvatarRenderer avatarConfig={user.avatarConfig} size={22} />
            <span className="text-xs font-medium text-[#F0F2F8] hidden sm:inline">
              {user.username}
            </span>
            <VoxelBadge variant="emerald" className="hidden lg:inline-flex">
              Skin 64x64
            </VoxelBadge>
          </div>
        )}

        {/* Configurações de Hardware */}
        <button
          onClick={() => setDeviceSettingsOpen(true)}
          className="p-1.5 text-[#9DA3B4] hover:text-white hover:bg-[#1E222D] rounded transition-colors cursor-pointer"
          title="Configurações de Áudio, Vídeo e DroidCam"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Controles Nativos de Janela (Tauri) */}
        <div className="flex items-center ml-2 border-l border-[#222634] pl-2 gap-1">
          <button
            onClick={() => handleWindowAction('minimize')}
            className="p-1 text-[#9DA3B4] hover:text-white hover:bg-[#1E222D] rounded cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleWindowAction('maximize')}
            className="p-1 text-[#9DA3B4] hover:text-white hover:bg-[#1E222D] rounded cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleWindowAction('close')}
            className="p-1 text-[#9DA3B4] hover:text-[#FF5555] hover:bg-[#3D1515] rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
