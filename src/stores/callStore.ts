import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CallParticipant, BiomeDimensionTheme, CallChatMsg } from '../types/call.types';
import { DEFAULT_AVATAR } from '../types/skin.types';

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
  activeBiomeTheme: BiomeDimensionTheme;
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
  setBiomeTheme: (theme: BiomeDimensionTheme) => void;
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
    activeBiomeTheme: 'plains',
    callMessages: [],

    joinRoom: (roomId, name, type) =>
      set((state) => {
        state.activeRoomId = roomId;
        state.roomName = name;
        state.callType = type;
        state.isInCall = true;
        state.callMessages = [];

        // Participante local
        state.participants['local-steve-1234'] = {
          id: 'local-steve-1234',
          username: 'SteveMiner (Você)',
          discriminator: '2026',
          avatarConfig: { ...DEFAULT_AVATAR },
          isAudioMuted: false,
          isVideoMuted: true,
          isScreenSharing: false,
          isDeafened: false,
          isSpeaking: false,
          volume: 100,
          dimensionTheme: state.activeBiomeTheme,
        };

        // Participantes simulados para imersão inicial
        if (type === 'server') {
          state.participants['friend-alex'] = {
            id: 'friend-alex',
            username: 'AlexExplorer',
            discriminator: '1337',
            avatarConfig: {
              ...DEFAULT_AVATAR,
              hairStyle: 'alex_ponytail',
              hairColor: 'ginger',
              outfit: 'diamond_chestplate',
              heldItem: 'golden_apple',
              facialHair: 'none',
              accessory: 'diamond_crown',
            },
            isAudioMuted: false,
            isVideoMuted: true,
            isScreenSharing: false,
            isDeafened: false,
            isSpeaking: false,
            volume: 100,
            dimensionTheme: 'the_end',
          };

          state.participants['friend-notcher'] = {
            id: 'friend-notcher',
            username: 'RedstoneLord',
            discriminator: '4040',
            avatarConfig: {
              ...DEFAULT_AVATAR,
              hairStyle: 'curly_crop',
              hairColor: 'black',
              skinTone: 'tan',
              outfit: 'tuxedo',
              heldItem: 'redstone_torch',
              facialHair: 'mustache',
              accessory: 'pixel_glasses',
            },
            isAudioMuted: true,
            isVideoMuted: true,
            isScreenSharing: false,
            isDeafened: false,
            isSpeaking: false,
            volume: 100,
            dimensionTheme: 'plains',
          };
        } else {
          // Chamada P2P com Alex
          state.participants['friend-alex'] = {
            id: 'friend-alex',
            username: 'AlexExplorer',
            discriminator: '1337',
            avatarConfig: {
              ...DEFAULT_AVATAR,
              hairStyle: 'alex_ponytail',
              hairColor: 'ginger',
              outfit: 'diamond_chestplate',
              heldItem: 'golden_apple',
              facialHair: 'none',
              accessory: 'diamond_crown',
            },
            isAudioMuted: false,
            isVideoMuted: true,
            isScreenSharing: false,
            isDeafened: false,
            isSpeaking: false,
            volume: 100,
            dimensionTheme: 'plains',
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
        if (state.participants['local-steve-1234']) {
          state.participants['local-steve-1234'].isAudioMuted = state.isAudioMuted;
        }
      }),

    toggleVideo: () =>
      set((state) => {
        state.isVideoMuted = !state.isVideoMuted;
        if (state.participants['local-steve-1234']) {
          state.participants['local-steve-1234'].isVideoMuted = state.isVideoMuted;
        }
      }),

    toggleDeafen: () =>
      set((state) => {
        state.isDeafened = !state.isDeafened;
        if (state.isDeafened) {
          state.isAudioMuted = true;
        }
        if (state.participants['local-steve-1234']) {
          state.participants['local-steve-1234'].isDeafened = state.isDeafened;
          state.participants['local-steve-1234'].isAudioMuted = state.isAudioMuted;
        }
      }),

    toggleScreenShare: () =>
      set((state) => {
        state.isScreenSharing = !state.isScreenSharing;
        if (state.participants['local-steve-1234']) {
          state.participants['local-steve-1234'].isScreenSharing = state.isScreenSharing;
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

    setBiomeTheme: (theme) =>
      set((state) => {
        state.activeBiomeTheme = theme;
        if (state.participants['local-steve-1234']) {
          state.participants['local-steve-1234'].dimensionTheme = theme;
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
