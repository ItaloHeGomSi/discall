export interface ReactionItem {
  id: string;
  emoji: string;
  senderId: string;
  timestamp: number;
}

export interface CallParticipant {
  id: string;
  username: string;
  avatarColor: string;
  avatarUrl?: string;
  stream?: MediaStream;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  volume: number; // 0% a 200%
  activeReaction?: ReactionItem;
}

export interface CallChatMsg {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}
