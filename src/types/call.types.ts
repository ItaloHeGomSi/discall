import { AvatarComposition } from './skin.types';

export type BiomeDimensionTheme = 'plains' | 'nether' | 'the_end' | 'deep_dark';

export interface ReactionItem {
  id: string;
  emoji: string;
  senderId: string;
  timestamp: number;
}

export interface CallParticipant {
  id: string;
  username: string;
  discriminator: string;
  avatarConfig: AvatarComposition;
  realPhotoUrl?: string;
  stream?: MediaStream;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  volume: number; // 0% a 200%
  activeReaction?: ReactionItem;
  dimensionTheme: BiomeDimensionTheme;
}

export interface CallChatMsg {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}
