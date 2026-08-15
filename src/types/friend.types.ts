import { AvatarComposition } from './skin.types';

export type UserStatus = 'online' | 'in_game' | 'idle' | 'offline';

export interface Friend {
  id: string;
  username: string;
  discriminator: string;
  customNickname?: string;
  status: UserStatus;
  activity?: {
    gameName: string;
    dimension: 'Overworld' | 'Nether' | 'The End' | 'Deep Dark';
    details: string;
    elapsedTime: number;
  };
  avatarConfig: AvatarComposition;
  realPhotoUrl?: string;
  isBlocked: boolean;
  unreadDirectMessages?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromDiscriminator: string;
  avatarConfig: AvatarComposition;
  createdAt: number;
  type: 'incoming' | 'outgoing';
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  attachments?: string[];
}
