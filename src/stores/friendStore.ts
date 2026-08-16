import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Friend, FriendRequest, DirectMessage } from '../types/friend.types';
import { colorForId } from '../utils/avatarColor';
import { LOCAL_USER_ID } from '../constants';

interface FriendState {
  friends: Record<string, Friend>;
  requests: FriendRequest[];
  activeDmFriendId: string | null;
  directMessages: Record<string, DirectMessage[]>; // friendId -> messages

  // Ações
  setCustomNickname: (friendId: string, nickname: string) => void;
  removeFriend: (friendId: string) => void;
  blockUser: (friendId: string) => void;
  unblockUser: (friendId: string) => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  sendRequest: (username: string, email: string) => void;
  setActiveDm: (friendId: string | null) => void;
  sendDirectMessage: (friendId: string, content: string, senderId: string) => void;
}

const INITIAL_FRIENDS: Record<string, Friend> = {
  'friend-ana': {
    id: 'friend-ana',
    username: 'Ana Torres',
    email: 'ana.torres@empresa.com',
    status: 'busy',
    statusMessage: 'Em reunião até as 15h',
    avatarColor: colorForId('friend-ana'),
    isBlocked: false,
  },
  'friend-marcos': {
    id: 'friend-marcos',
    username: 'Marcos Lima',
    email: 'marcos.lima@empresa.com',
    status: 'online',
    statusMessage: 'Disponível para pair programming',
    avatarColor: colorForId('friend-marcos'),
    isBlocked: false,
  },
  'friend-beatriz': {
    id: 'friend-beatriz',
    username: 'Beatriz Souza',
    email: 'beatriz.souza@empresa.com',
    status: 'away',
    statusMessage: 'Volto em 10 minutos',
    avatarColor: colorForId('friend-beatriz'),
    isBlocked: false,
  },
};

const INITIAL_REQUESTS: FriendRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'user-carlos',
    fromUsername: 'Carlos Mendes',
    fromEmail: 'carlos.mendes@empresa.com',
    avatarColor: colorForId('user-carlos'),
    createdAt: Date.now() - 3600000,
    type: 'incoming',
  },
];

export const useFriendStore = create<FriendState>()(
  immer((set) => ({
    friends: INITIAL_FRIENDS,
    requests: INITIAL_REQUESTS,
    activeDmFriendId: null,
    directMessages: {
      'friend-ana': [
        {
          id: 'm1',
          senderId: 'friend-ana',
          receiverId: LOCAL_USER_ID,
          content: 'Oi! Vamos revisar a apresentação hoje à tarde?',
          timestamp: Date.now() - 120000,
        },
        {
          id: 'm2',
          senderId: LOCAL_USER_ID,
          receiverId: 'friend-ana',
          content: 'Combinado! Te chamo na sala de reunião às 14h.',
          timestamp: Date.now() - 60000,
        },
      ],
    },

    setCustomNickname: (friendId, nickname) =>
      set((state) => {
        if (state.friends[friendId]) {
          state.friends[friendId].customNickname = nickname.trim() || undefined;
        }
      }),

    removeFriend: (friendId) =>
      set((state) => {
        delete state.friends[friendId];
        if (state.activeDmFriendId === friendId) {
          state.activeDmFriendId = null;
        }
      }),

    blockUser: (friendId) =>
      set((state) => {
        if (state.friends[friendId]) {
          state.friends[friendId].isBlocked = true;
        }
      }),

    unblockUser: (friendId) =>
      set((state) => {
        if (state.friends[friendId]) {
          state.friends[friendId].isBlocked = false;
        }
      }),

    acceptRequest: (requestId) =>
      set((state) => {
        const reqIndex = state.requests.findIndex((r) => r.id === requestId);
        if (reqIndex !== -1) {
          const req = state.requests[reqIndex];
          state.friends[req.fromUserId] = {
            id: req.fromUserId,
            username: req.fromUsername,
            email: req.fromEmail,
            status: 'online',
            avatarColor: req.avatarColor,
            isBlocked: false,
          };
          state.requests.splice(reqIndex, 1);
        }
      }),

    declineRequest: (requestId) =>
      set((state) => {
        state.requests = state.requests.filter((r) => r.id !== requestId);
      }),

    sendRequest: (username, email) =>
      set((state) => {
        const fromUserId = `user-temp-${Date.now()}`;
        state.requests.push({
          id: `req-${crypto.randomUUID().slice(0, 6)}`,
          fromUserId,
          fromUsername: username,
          fromEmail: email,
          avatarColor: colorForId(fromUserId),
          createdAt: Date.now(),
          type: 'outgoing',
        });
      }),

    setActiveDm: (friendId) =>
      set((state) => {
        state.activeDmFriendId = friendId;
      }),

    sendDirectMessage: (friendId, content, senderId) =>
      set((state) => {
        if (!state.directMessages[friendId]) {
          state.directMessages[friendId] = [];
        }
        state.directMessages[friendId].push({
          id: `msg-${Date.now()}`,
          senderId,
          receiverId: friendId,
          content,
          timestamp: Date.now(),
        });
      }),
  }))
);
