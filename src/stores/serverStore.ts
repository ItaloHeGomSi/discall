import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Server, ServerChatMessage } from '../types/server.types';
import { PermissionFlags } from '../types/permissions';
import { LOCAL_USER_ID } from '../constants';

interface ServerState {
  servers: Record<string, Server>;
  activeServerId: string | null;
  activeChannelId: string | null;
  channelMessages: Record<string, ServerChatMessage[]>; // channelId -> messages

  // Ações
  setActiveServer: (serverId: string | null) => void;
  setActiveChannel: (channelId: string | null) => void;
  createServer: (name: string, ownerId: string) => void;
  createChannel: (serverId: string, name: string, type: 'text' | 'voice') => void;
  sendChannelMessage: (serverId: string, channelId: string, authorId: string, authorName: string, content: string) => void;
}

const INITIAL_SERVERS: Record<string, Server> = {
  'group-produto': {
    id: 'group-produto',
    name: 'Equipe de Produto',
    ownerId: LOCAL_USER_ID,
    description: 'Espaço de trabalho para alinhamento de produto e design.',
    roles: {
      'role-owner': {
        id: 'role-owner',
        name: 'Proprietário',
        colorHex: '#5B7CFA',
        position: 100,
        permissions: PermissionFlags.ADMINISTRATOR,
        isMentionable: true,
      },
      'role-admin': {
        id: 'role-admin',
        name: 'Administrador',
        colorHex: '#22C55E',
        position: 50,
        permissions: PermissionFlags.MUTE_MEMBERS | PermissionFlags.KICK_MEMBERS | PermissionFlags.REVOKE_SCREENSHARE | PermissionFlags.CONNECT_VOICE | PermissionFlags.SPEAK_VOICE | PermissionFlags.SEND_MESSAGES | PermissionFlags.VIEW_CHANNELS,
        isMentionable: true,
      },
      'role-member': {
        id: 'role-member',
        name: 'Membro',
        colorHex: '#9AA3B2',
        position: 10,
        permissions: PermissionFlags.CONNECT_VOICE | PermissionFlags.SPEAK_VOICE | PermissionFlags.SHARE_SCREEN | PermissionFlags.SEND_MESSAGES | PermissionFlags.VIEW_CHANNELS,
        isMentionable: false,
      },
    },
    members: {
      [LOCAL_USER_ID]: {
        userId: LOCAL_USER_ID,
        roleIds: ['role-owner'],
        isOwner: true,
        joinedAt: Date.now() - 86400000 * 30,
      },
      'friend-ana': {
        userId: 'friend-ana',
        roleIds: ['role-admin'],
        isOwner: false,
        joinedAt: Date.now() - 86400000 * 15,
      },
      'friend-marcos': {
        userId: 'friend-marcos',
        roleIds: ['role-member'],
        isOwner: false,
        joinedAt: Date.now() - 86400000 * 5,
      },
    },
    channels: [
      { id: 'ch-geral', name: 'geral', type: 'text', position: 1, topic: 'Conversas gerais da equipe' },
      { id: 'ch-anuncios', name: 'anuncios', type: 'text', position: 2, topic: 'Comunicados importantes' },
      { id: 'ch-voice-1', name: 'Sala de Reunião', type: 'voice', position: 3, bitrate: 128000 },
      { id: 'ch-voice-2', name: 'Daily Standup', type: 'voice', position: 4, bitrate: 128000 },
      { id: 'ch-voice-3', name: 'Foco (Silenciosa)', type: 'voice', position: 5, bitrate: 96000 },
    ],
  },
  'group-engenharia': {
    id: 'group-engenharia',
    name: 'Equipe de Engenharia',
    ownerId: 'friend-marcos',
    description: 'Discussões técnicas, revisões de código e planejamento de sprint.',
    roles: {
      'role-admin': {
        id: 'role-admin',
        name: 'Administrador',
        colorHex: '#5B7CFA',
        position: 100,
        permissions: PermissionFlags.ADMINISTRATOR,
        isMentionable: true,
      },
    },
    members: {
      'friend-marcos': {
        userId: 'friend-marcos',
        roleIds: ['role-admin'],
        isOwner: true,
        joinedAt: Date.now() - 86400000 * 60,
      },
      [LOCAL_USER_ID]: {
        userId: LOCAL_USER_ID,
        roleIds: [],
        isOwner: false,
        joinedAt: Date.now() - 86400000 * 2,
      },
    },
    channels: [
      { id: 'ch-eng-text', name: 'projetos', type: 'text', position: 1 },
      { id: 'ch-eng-voice', name: 'Pair Programming', type: 'voice', position: 2, bitrate: 128000 },
    ],
  },
};

export const useServerStore = create<ServerState>()(
  immer((set) => ({
    servers: INITIAL_SERVERS,
    activeServerId: 'group-produto',
    activeChannelId: 'ch-geral',
    channelMessages: {
      'ch-geral': [
        {
          id: 'cm1',
          serverId: 'group-produto',
          channelId: 'ch-geral',
          authorId: 'friend-ana',
          authorName: 'Ana Torres',
          content: 'Alguém pode revisar o protótipo antes da reunião das 14h?',
          timestamp: Date.now() - 300000,
        },
        {
          id: 'cm2',
          serverId: 'group-produto',
          channelId: 'ch-geral',
          authorId: LOCAL_USER_ID,
          authorName: 'Você',
          content: 'Claro, já estou dando uma olhada agora!',
          timestamp: Date.now() - 180000,
        },
      ],
    },

    setActiveServer: (serverId) =>
      set((state) => {
        state.activeServerId = serverId;
        if (serverId && state.servers[serverId]?.channels.length > 0) {
          state.activeChannelId = state.servers[serverId].channels[0].id;
        } else {
          state.activeChannelId = null;
        }
      }),

    setActiveChannel: (channelId) =>
      set((state) => {
        state.activeChannelId = channelId;
      }),

    createServer: (name, ownerId) =>
      set((state) => {
        const id = `group-${crypto.randomUUID().slice(0, 8)}`;
        state.servers[id] = {
          id,
          name,
          ownerId,
          roles: {
            'role-owner': {
              id: 'role-owner',
              name: 'Proprietário',
              colorHex: '#5B7CFA',
              position: 100,
              permissions: PermissionFlags.ADMINISTRATOR,
              isMentionable: true,
            },
          },
          members: {
            [ownerId]: {
              userId: ownerId,
              roleIds: ['role-owner'],
              isOwner: true,
              joinedAt: Date.now(),
            },
          },
          channels: [
            { id: `ch-${Date.now()}-1`, name: 'geral', type: 'text', position: 1 },
            { id: `ch-${Date.now()}-2`, name: 'Sala Principal', type: 'voice', position: 2, bitrate: 128000 },
          ],
        };
        state.activeServerId = id;
        state.activeChannelId = state.servers[id].channels[0].id;
      }),

    createChannel: (serverId, name, type) =>
      set((state) => {
        if (state.servers[serverId]) {
          const newCh: any = {
            id: `ch-${Date.now()}`,
            name,
            type,
            position: state.servers[serverId].channels.length + 1,
            bitrate: type === 'voice' ? 128000 : undefined,
          };
          state.servers[serverId].channels.push(newCh);
        }
      }),

    sendChannelMessage: (serverId, channelId, authorId, authorName, content) =>
      set((state) => {
        if (!state.channelMessages[channelId]) {
          state.channelMessages[channelId] = [];
        }
        state.channelMessages[channelId].push({
          id: `cmsg-${Date.now()}`,
          serverId,
          channelId,
          authorId,
          authorName,
          content,
          timestamp: Date.now(),
        });
      }),
  }))
);
