import { ServerMember, ServerRole } from './permissions';

export type ChannelType = 'text' | 'voice';

export interface ServerChannel {
  id: string;
  name: string;
  type: ChannelType;
  topic?: string;
  bitrate?: number; // ex: 64000 ou 128000 bps
  userLimit?: number;
  position: number;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  channels: ServerChannel[];
  roles: Record<string, ServerRole>;
  members: Record<string, ServerMember>;
  bannerUrl?: string;
  description?: string;
}

export interface ServerChatMessage {
  id: string;
  serverId: string;
  channelId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number;
  attachments?: string[];
}
