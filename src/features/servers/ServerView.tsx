import React from 'react';
import { useServerStore } from '../../stores/serverStore';
import { useCallStore } from '../../stores/callStore';
import { useFriendStore } from '../../stores/friendStore';
import { useAuthStore } from '../../stores/authStore';
import { ChannelList } from './ChannelList';
import { ServerChatPanel } from './ServerChatPanel';
import { CallGrid } from '../call/CallGrid';
import { CanvasAvatarRenderer } from '../../components/avatar/CanvasAvatarRenderer';
import { Shield, Crown, Users } from 'lucide-react';

export const ServerView: React.FC = () => {
  const { servers, activeServerId, activeChannelId } = useServerStore();
  const { isInCall, callType } = useCallStore();
  const { friends } = useFriendStore();
  const { user } = useAuthStore();

  if (!activeServerId || !servers[activeServerId]) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#646A7E] text-sm">
        Selecione um servidor na barra lateral para começar.
      </div>
    );
  }

  const server = servers[activeServerId];
  const activeChannel = server.channels.find((c) => c.id === activeChannelId);

  // Lista de membros do servidor
  const memberList = Object.values(server.members).map((m) => {
    if (m.userId === user?.id) {
      return {
        ...m,
        username: `${user.username} (Você)`,
        avatarConfig: user.avatarConfig,
        status: user.status,
      };
    }
    const friendData = friends[m.userId];
    return {
      ...m,
      username: friendData ? friendData.username : `Membro-${m.userId.slice(0, 5)}`,
      avatarConfig: friendData ? friendData.avatarConfig : user!.avatarConfig,
      status: friendData ? friendData.status : 'offline',
    };
  });

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-transparent">
      {/* 1. Lista de Canais */}
      <ChannelList server={server} />

      {/* 2. Área Central: Chamada de Voz Ativa OU Chat do Canal de Texto */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#090A0D]/55 backdrop-blur-xs">
        {isInCall && callType === 'server' ? (
          <CallGrid />
        ) : activeChannel && activeChannel.type === 'text' ? (
          <ServerChatPanel server={server} channel={activeChannel} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#646A7E]">
            <Users className="w-10 h-10 mb-2 text-[#55FF55]/60" />
            <h3 className="text-base font-semibold text-[#F0F2F8]">
              Canal de Voz: {activeChannel?.name || 'Selecione um canal'}
            </h3>
            <p className="text-xs text-[#9DA3B4] mt-1 max-w-sm">
              Clique duas vezes no canal de voz à esquerda para entrar na chamada com seus amigos.
            </p>
          </div>
        )}
      </div>

      {/* 3. Lista de Membros à Direita */}
      <div className="w-56 bg-[#111318]/75 backdrop-blur-xs border-l border-[#222634]/70 flex flex-col p-3 overflow-y-auto shrink-0 select-none hidden lg:flex">
        <span className="text-[11px] font-mono font-semibold uppercase text-[#646A7E] tracking-wider mb-3">
          Membros — {memberList.length}
        </span>

        <div className="space-y-4">
          <div className="space-y-1.5">
            {memberList.map((m) => (
              <div
                key={m.userId}
                className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#1A1D26]/80 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <CanvasAvatarRenderer avatarConfig={m.avatarConfig} size={28} />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#111318] ${
                      m.status === 'online' ? 'bg-[#55FF55]' : 'bg-[#646A7E]'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    {m.isOwner ? (
                      <Crown className="w-3 h-3 text-[#FFAA00] shrink-0" />
                    ) : m.roleIds.length > 0 ? (
                      <Shield className="w-3 h-3 text-[#55FFFF] shrink-0" />
                    ) : null}
                    <span className="text-xs font-medium text-[#E2E4EB] truncate">
                      {m.username}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
