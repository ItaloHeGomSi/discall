export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface Friend {
  id: string;
  username: string;
  email: string;
  customNickname?: string;
  status: UserStatus;
  statusMessage?: string;
  avatarColor: string;
  avatarUrl?: string;
  isBlocked: boolean;
  unreadDirectMessages?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromEmail: string;
  avatarColor: string;
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
