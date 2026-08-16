import React, { useState } from 'react';
import { useFriendStore } from '../../stores/friendStore';
import { FriendItem } from './FriendItem';
import { PendingRequestsTab } from './PendingRequestsTab';
import { DirectChatPanel } from './DirectChatPanel';
import { Users, MessageSquare } from 'lucide-react';

type SubTab = 'online' | 'all' | 'pending' | 'blocked' | 'add_friend';

export const FriendsView: React.FC = () => {
  const { friends, requests, activeDmFriendId, setActiveDm } = useFriendStore();
  const [subTab, setSubTab] = useState<SubTab>('online');
  const [searchQuery, setSearchQuery] = useState('');

  const friendList = Object.values(friends);
  const pendingCount = requests.filter((r) => r.type === 'incoming').length;

  const filteredFriends = friendList.filter((f) => {
    if (subTab === 'blocked') return f.isBlocked;
    if (f.isBlocked) return false;

    if (subTab === 'online') {
      if (f.status === 'offline') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.username.toLowerCase().includes(q);
      const matchNick = f.customNickname?.toLowerCase().includes(q);
      return matchName || matchNick;
    }

    return true;
  });

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Coluna Esquerda: Lista de DMs */}
      <div className="w-60 bg-[#0E1015] border-r border-[#22262F] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#22262F]">
          <button
            onClick={() => {
              setActiveDm(null);
              setSubTab('online');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              activeDmFriendId === null
                ? 'bg-[#5B7CFA] text-white shadow-[0_0_10px_rgba(91,124,250,0.4)]'
                : 'text-[#9AA3B2] hover:bg-[#1B1F29] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contatos</span>
          </button>
        </div>

        {/* Lista de Mensagens Diretas */}
        <div className="p-3">
          <span className="text-[11px] font-semibold uppercase text-[#9AA3B2] tracking-wider block mb-2">
            Mensagens Diretas
          </span>
          <div className="space-y-1 overflow-y-auto">
            {friendList.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveDm(f.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeDmFriendId === f.id
                    ? 'bg-[#1B2340] text-[#93A6FF]'
                    : 'text-[#9AA3B2] hover:bg-[#161A22] hover:text-[#E2E4EB]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    f.status === 'online'
                      ? 'bg-[#22C55E]'
                      : f.status === 'busy'
                      ? 'bg-[#EF4444]'
                      : f.status === 'away'
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#626B7A]'
                  }`}
                />
                <span className="truncate flex-1">{f.customNickname || f.username}</span>
                <MessageSquare className="w-3 h-3 text-[#626B7A]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Central */}
      {activeDmFriendId ? (
        <DirectChatPanel friendId={activeDmFriendId} />
      ) : (
        <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden">
          {/* Header com Sub-abas */}
          <div className="h-14 border-b border-[#22262F] px-4 flex items-center justify-between bg-[#12151C] shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 pr-3 border-r border-[#22262F] text-sm font-semibold text-[#F1F3F8]">
                <Users className="w-4 h-4 text-[#5B7CFA]" />
                <span>Contatos</span>
              </div>

              <button
                onClick={() => setSubTab('online')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'online'
                    ? 'bg-[#1B2340] text-[#93A6FF]'
                    : 'text-[#9AA3B2] hover:text-white'
                }`}
              >
                Disponíveis
              </button>

              <button
                onClick={() => setSubTab('all')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'all'
                    ? 'bg-[#1B2340] text-[#93A6FF]'
                    : 'text-[#9AA3B2] hover:text-white'
                }`}
              >
                Todos ({friendList.length})
              </button>

              <button
                onClick={() => setSubTab('pending')}
                className={`relative px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'pending'
                    ? 'bg-[#1B2340] text-[#93A6FF]'
                    : 'text-[#9AA3B2] hover:text-white'
                }`}
              >
                Pendentes
                {pendingCount > 0 && (
                  <span className="ml-1.5 bg-[#EF4444] text-white font-bold text-[10px] px-1 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSubTab('blocked')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'blocked'
                    ? 'bg-[#3A1616] text-[#EF4444]'
                    : 'text-[#9AA3B2] hover:text-white'
                }`}
              >
                Bloqueados
              </button>

              <button
                onClick={() => setSubTab('add_friend')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'add_friend'
                    ? 'bg-[#5B7CFA] text-white'
                    : 'bg-[#12321F] text-[#5EDB8F] hover:bg-[#164A2C]'
                }`}
              >
                + Adicionar Contato
              </button>
            </div>
          </div>

          {/* Corpo da Aba */}
          <div className="flex-1 p-5 overflow-y-auto">
            {subTab === 'pending' || subTab === 'add_friend' ? (
              <PendingRequestsTab />
            ) : (
              <div className="space-y-4 max-w-4xl">
                {/* Barra de Busca */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar contatos pelo nome ou apelido..."
                  className="w-full bg-[#12151C] border border-[#22262F] rounded-lg px-4 py-2.5 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
                />

                <div className="text-xs font-semibold uppercase text-[#9AA3B2] tracking-wider">
                  {subTab === 'online' ? 'Contatos Disponíveis' : 'Lista Completa'} —{' '}
                  {filteredFriends.length}
                </div>

                {/* Lista de Contatos */}
                {filteredFriends.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#22262F] rounded-lg text-xs text-[#626B7A] bg-[#12151C]/40">
                    Nenhum contato encontrado neste filtro.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFriends.map((f) => (
                      <FriendItem key={f.id} friend={f} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
