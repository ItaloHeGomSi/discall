import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useServerStore } from '../../stores/serverStore';
import { useFriendStore } from '../../stores/friendStore';
import { useClipStore } from '../../stores/clipStore';
import { Users, Film, Plus, Building2 } from 'lucide-react';

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

  const handleSelectClips = () => {
    setActiveMainTab('clips');
    setActiveServer(null);
  };

  const handleSelectServer = (serverId: string) => {
    setActiveMainTab('server');
    setActiveServer(serverId);
  };

  return (
    <nav className="w-18 bg-[#0E1015] border-r border-[#22262F] flex flex-col items-center py-3 gap-2.5 select-none z-20 shrink-0">
      {/* Botão Principal: Contatos e DMs */}
      <div className="relative group">
        <button
          onClick={handleSelectFriends}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            activeMainTab === 'friends'
              ? 'bg-[#5B7CFA] text-white shadow-[0_0_12px_rgba(91,124,250,0.4)]'
              : 'bg-[#12151C] hover:bg-[#1B1F29] text-[#9AA3B2] hover:text-white'
          }`}
          title="Contatos e Mensagens Diretas"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Badge de solicitações pendentes */}
        {pendingRequestsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full border-2 border-[#0E1015]">
            {pendingRequestsCount}
          </span>
        )}

        {activeMainTab === 'friends' && (
          <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#5B7CFA] rounded-r" />
        )}
      </div>

      {/* Botão: Gravações Salvas em Disco */}
      <div className="relative group">
        <button
          onClick={handleSelectClips}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            activeMainTab === 'clips'
              ? 'bg-[#5B7CFA] text-white shadow-[0_0_12px_rgba(91,124,250,0.4)]'
              : 'bg-[#12151C] hover:bg-[#1B1F29] text-[#9AA3B2] hover:text-white'
          }`}
          title="Gravações Salvas"
        >
          <Film className="w-5 h-5" />
        </button>

        {clips.length > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-[#1B1F29] text-[#93A6FF] text-[9px] px-1 rounded border border-[#333A48]">
            {clips.length}
          </span>
        )}

        {activeMainTab === 'clips' && (
          <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#5B7CFA] rounded-r" />
        )}
      </div>

      {/* Divisor */}
      <div className="w-8 h-[2px] bg-[#22262F] my-1 rounded" />

      {/* Lista de Grupos */}
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
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#1B1F29] text-[#93A6FF] border-[#5B7CFA]'
                    : 'bg-[#12151C] hover:bg-[#1B1F29] text-[#E2E4EB] border-[#22262F] hover:border-[#333A48]'
                }`}
                title={srv.name}
              >
                {initials || <Building2 className="w-5 h-5" />}
              </button>

              {isActive && (
                <div className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#5B7CFA] rounded-r" />
              )}
            </div>
          );
        })}

        {/* Botão: Criar Novo Grupo */}
        <button
          onClick={() => setCreateServerModalOpen(true)}
          className="w-12 h-12 rounded-xl bg-[#12151C] hover:bg-[#1B2340] border border-dashed border-[#333A48] hover:border-[#5B7CFA] text-[#5B7CFA] flex items-center justify-center transition-all duration-200 cursor-pointer group"
          title="Criar Novo Grupo"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
};
