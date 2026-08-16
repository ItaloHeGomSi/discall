import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CallParticipant, CallChatMsg } from '../types/call.types';
import { colorForId } from '../utils/avatarColor';
import { LOCAL_USER_ID } from '../constants';

interface CallState {
  activeRoomId: string | null;
  roomName: string | null;
  isInCall: boolean;
  callType: 'server' | 'p2p' | null;
  participants: Record<string, CallParticipant>;
  localStream: MediaStream | null;
  screenShareStream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isRecording: boolean;
  callMessages: CallChatMsg[];

  // Ações
  joinRoom: (roomId: string, name: string, type: 'server' | 'p2p') => void;
  leaveRoom: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setScreenShareStream: (stream: MediaStream | null) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleDeafen: () => void;
  toggleScreenShare: () => void;
  toggleChat: () => void;
  setIsRecording: (recording: boolean) => void;
  setParticipantSpeaking: (participantId: string, isSpeaking: boolean) => void;
  setParticipantVolume: (participantId: string, volume: number) => void;
  triggerReaction: (participantId: string, emoji: string) => void;
  sendCallMessage: (senderId: string, senderName: string, content: string) => void;
}

export const useCallStore = create<CallState>()(
  immer((set) => ({
    activeRoomId: null,
    roomName: null,
    isInCall: false,
    callType: null,
    participants: {},
    localStream: null,
    screenShareStream: null,
    isAudioMuted: false,
    isVideoMuted: true,
    isDeafened: false,
    isScreenSharing: false,
    isChatOpen: false,
    isRecording: false,
    callMessages: [],

    joinRoom: (roomId, name, type) =>
      set((state) => {
        state.activeRoomId = roomId;
        state.roomName = name;
        state.callType = type;
        state.isInCall = true;
        state.callMessages = [];

        // Participante local
        state.participants[LOCAL_USER_ID] = {
          id: LOCAL_USER_ID,
          username: 'Você',
          avatarColor: colorForId(LOCAL_USER_ID),
          isAudioMuted: false,
          isVideoMuted: true,
          isScreenSharing: false,
          isDeafened: false,
          isSpeaking: false,
          volume: 100,
        };

        // Participantes simulados para imersão inicial
        if (type === 'server') {
          state.participants['friend-ana'] = {
            id: 'friend-ana',
            username: 'Ana Torres',
            avatarColor: colorForId('friend-ana'),
            isAudioMuted: false,
            isVideoMuted: true,
            isScreenSharing: false,
            isDeafened: false,
            isSpeaking: false,
            volume: 100,
          };

          state.participants['friend-marcos'] = {
            id: 'friend-marcos',
            username: 'Marcos Lima',
            avatarColor: colorForId('friend-marcos'),
            isAudioMuted: true,
            isVideoMuted: true,
            isScreenSharing: false,
            isDeafened: false,
            isSpeaking: false,
            volume: 100,
          };
        } else {
          // Chamada P2P
          state.participants['friend-ana'] = {
            id: 'friend-ana',
            username: 'Ana Torres',
            avatarColor: colorForId('friend-ana'),
            isAudioMuted: false,
            isVideoMuted: true,
            isScreenSharing: false,
            isDeafened: false,
            isSpeaking: false,
            volume: 100,
          };
        }
      }),

    leaveRoom: () =>
      set((state) => {
        state.activeRoomId = null;
        state.roomName = null;
        state.callType = null;
        state.isInCall = false;
        state.participants = {};
        state.isScreenSharing = false;
        state.screenShareStream = null;
        state.isRecording = false;
        state.isChatOpen = false;
      }),

    setLocalStream: (stream) =>
      set((state) => {
        state.localStream = stream;
      }),

    setScreenShareStream: (stream) =>
      set((state) => {
        state.screenShareStream = stream;
        state.isScreenSharing = !!stream;
      }),

    toggleAudio: () =>
      set((state) => {
        state.isAudioMuted = !state.isAudioMuted;
        if (state.participants[LOCAL_USER_ID]) {
          state.participants[LOCAL_USER_ID].isAudioMuted = state.isAudioMuted;
        }
      }),

    toggleVideo: () =>
      set((state) => {
        state.isVideoMuted = !state.isVideoMuted;
        if (state.participants[LOCAL_USER_ID]) {
          state.participants[LOCAL_USER_ID].isVideoMuted = state.isVideoMuted;
        }
      }),

    toggleDeafen: () =>
      set((state) => {
        state.isDeafened = !state.isDeafened;
        if (state.isDeafened) {
          state.isAudioMuted = true;
        }
        if (state.participants[LOCAL_USER_ID]) {
          state.participants[LOCAL_USER_ID].isDeafened = state.isDeafened;
          state.participants[LOCAL_USER_ID].isAudioMuted = state.isAudioMuted;
        }
      }),

    toggleScreenShare: () =>
      set((state) => {
        state.isScreenSharing = !state.isScreenSharing;
        if (state.participants[LOCAL_USER_ID]) {
          state.participants[LOCAL_USER_ID].isScreenSharing = state.isScreenSharing;
        }
      }),

    toggleChat: () =>
      set((state) => {
        state.isChatOpen = !state.isChatOpen;
      }),

    setIsRecording: (recording) =>
      set((state) => {
        state.isRecording = recording;
      }),

    setParticipantSpeaking: (participantId, isSpeaking) =>
      set((state) => {
        if (state.participants[participantId]) {
          state.participants[participantId].isSpeaking = isSpeaking;
        }
      }),

    setParticipantVolume: (participantId, volume) =>
      set((state) => {
        if (state.participants[participantId]) {
          state.participants[participantId].volume = volume;
        }
      }),

    triggerReaction: (participantId, emoji) =>
      set((state) => {
        if (state.participants[participantId]) {
          state.participants[participantId].activeReaction = {
            id: `react-${Date.now()}-${Math.random()}`,
            emoji,
            senderId: participantId,
            timestamp: Date.now(),
          };
        }
      }),

    sendCallMessage: (senderId, senderName, content) =>
      set((state) => {
        state.callMessages.push({
          id: `cmsg-${Date.now()}`,
          senderId,
          senderName,
          content,
          timestamp: Date.now(),
        });
      }),
  }))
);
