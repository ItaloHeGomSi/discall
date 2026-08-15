import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useServerStore } from '../../stores/serverStore';
import { useFriendStore } from '../../stores/friendStore';
import { useClipStore } from '../../stores/clipStore';
import { 
  Users, 
  Flame, 
  Film, 
  Plus, 
  Compass
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeMainTab, setActiveMainTab, setCreateServerModalOpen } = useUIStore();
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { requests } = useFriendStore();
  const { clips } = useClipStore();

  const pendingRequestsCount = requests.filter((r) => r.type === 'incoming').length;

  const handleSelectFriends = () => {
    setActiveMainTab('friends');
    setActiveServer(null);
  };

  const handleSelectCampfire = () => {
    setActiveMainTab('campfire_lounge');
    setActiveServer(null);
  };

  const handleSelectClips = () => {
    setActiveMainTab('clips');
    setActiveServer(null);
  };

  const handleSelectServer = (serverId: string) => {
    setActiveMainTab('server');
    setActiveServer(serverId);
  };

  return (
    <nav className="w-18 bg-[#090A0D]/75 backdrop-blur-xs border-r border-[#222634]/70 flex flex-col items-center py-3 gap-2.5 select-none z-20 shrink-0">
      {/* Botão Principal: Amigos e DMs */}
      <div className="relative group">
        <button
          onClick={handleSelectFriends}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            activeMainTab === 'friends'
              ? 'bg-[#228844] text-white rounded-lg shadow-[0_0_12px_rgba(85,255,85,0.4)]'
              : 'bg-[#14161C]/80 hover:bg-[#1E222D] text-[#9DA3B4] hover:text-white'
          }`}
          title="Amigos e Mensagens Diretas"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Badge de solicitações pendentes */}
        {pendingRequestsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FF5555] text-[#0C0D10] font-bold text-[10px] font-mono px-1.5 py-0.2 rounded-full border-2 border-[#090A0D] animate-bounce">
            {pendingRequestsCount}
          </span>
        )}

        {/* Marcador ativo lateral */}
        {activeMainTab === 'friends' && (
          <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#55FF55] rounded-r" />
        )}
      </div>

      {/* Botão: Campfire Lounge (Hub de Espera Interativo) */}
      <div className="relative group">
        <button
          onClick={handleSelectCampfire}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            activeMainTab === 'campfire_lounge'
              ? 'bg-[#FF8822] text-white rounded-lg shadow-[0_0_12px_rgba(255,136,34,0.4)]'
              : 'bg-[#14161C]/80 hover:bg-[#1E222D] text-[#9DA3B4] hover:text-white'
          }`}
          title="Campfire Voice Lounge (Lobby Interativo 2D)"
        >
          <Flame className="w-5 h-5" />
        </button>

        {activeMainTab === 'campfire_lounge' && (
          <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#FF8822] rounded-r" />
        )}
      </div>

      {/* Botão: Galeria de Clipes Salvos em Disco */}
      <div className="relative group">
        <button
          onClick={handleSelectClips}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            activeMainTab === 'clips'
              ? 'bg-[#3A82FF] text-white rounded-lg shadow-[0_0_12px_rgba(58,130,255,0.4)]'
              : 'bg-[#14161C]/80 hover:bg-[#1E222D] text-[#9DA3B4] hover:text-white'
          }`}
          title="Galeria de Clipes Gravados"
        >
          <Film className="w-5 h-5" />
        </button>

        {clips.length > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-[#1E222D] text-[#55FFFF] font-mono text-[9px] px-1 rounded border border-[#2B3142]">
            {clips.length}
          </span>
        )}

        {activeMainTab === 'clips' && (
          <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#3A82FF] rounded-r" />
        )}
      </div>

      {/* Divisor Voxel */}
      <div className="w-8 h-[2px] bg-[#222634] my-1 rounded" />

      {/* Lista de Servidores */}
      <div className="flex-1 w-full flex flex-col items-center gap-2.5 overflow-y-auto no-scrollbar py-1">
        {Object.values(servers).map((srv) => {
          const isActive = activeMainTab === 'server' && activeServerId === srv.id;
          const initials = srv.name
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('');

          return (
            <div key={srv.id} className="relative group">
              <button
                onClick={() => handleSelectServer(srv.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#1E222D]/90 text-[#55FF55] border-[#55FF55] rounded-lg shadow-[0_0_10px_rgba(85,255,85,0.3)]'
                    : 'bg-[#14161C]/80 hover:bg-[#1E222D] text-[#E2E4EB] border-[#222634] hover:border-[#343B4E]'
                }`}
                title={srv.name}
              >
                {initials || <Compass className="w-5 h-5" />}
              </button>

              {isActive && (
                <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#55FF55] rounded-r" />
              )}
            </div>
          );
        })}

        {/* Botão: Criar Novo Servidor */}
        <button
          onClick={() => setCreateServerModalOpen(true)}
          className="w-12 h-12 rounded-xl bg-[#14161C]/80 hover:bg-[#153D22] border border-dashed border-[#2B3142] hover:border-[#55FF55] text-[#55FF55] flex items-center justify-center transition-all duration-200 cursor-pointer group"
          title="Criar Novo Servidor"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
};
