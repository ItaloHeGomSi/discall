export const PermissionFlags = {
  NONE: 0n,
  VIEW_CHANNELS: 1n << 0n,        // 1
  SEND_MESSAGES: 1n << 1n,        // 2
  CONNECT_VOICE: 1n << 2n,        // 4
  SPEAK_VOICE: 1n << 3n,          // 8
  SHARE_SCREEN: 1n << 4n,         // 16
  PRIORITY_SPEAKER: 1n << 5n,     // 32
  MUTE_MEMBERS: 1n << 6n,         // 64  (Mute global)
  DEAFEN_MEMBERS: 1n << 7n,       // 128 (Ensurdecer membros)
  MOVE_MEMBERS: 1n << 8n,         // 256
  REVOKE_SCREENSHARE: 1n << 9n,   // 512 (Interromper stream)
  KICK_MEMBERS: 1n << 10n,        // 1024
  BAN_MEMBERS: 1n << 11n,         // 2048
  MANAGE_CHANNELS: 1n << 12n,     // 4096
  MANAGE_ROLES: 1n << 13n,        // 8192
  ADMINISTRATOR: 1n << 14n,       // 16384 (Bypassa todas as restrições)
} as const;

export type PermissionBit = typeof PermissionFlags[keyof typeof PermissionFlags];

export interface ServerRole {
  id: string;
  name: string;
  colorHex: string;
  position: number; // Hierarquia (maior = mais poder)
  permissions: bigint;
  isMentionable: boolean;
}

export interface ServerMember {
  userId: string;
  roleIds: string[];
  isOwner: boolean;
  joinedAt: number;
}

export function hasPermission(
  member: ServerMember,
  roles: Record<string, ServerRole>,
  requiredPermission: bigint
): boolean {
  if (member.isOwner) return true;

  let aggregatePermissions = 0n;
  for (const roleId of member.roleIds) {
    const role = roles[roleId];
    if (role) {
      aggregatePermissions |= role.permissions;
    }
  }

  // Administrador tem controle irrestrito
  if ((aggregatePermissions & PermissionFlags.ADMINISTRATOR) === PermissionFlags.ADMINISTRATOR) {
    return true;
  }

  return (aggregatePermissions & requiredPermission) === requiredPermission;
}
