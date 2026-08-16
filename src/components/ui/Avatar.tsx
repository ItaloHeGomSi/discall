import React from 'react';
import { initialsFor } from '../../utils/avatarColor';

interface AvatarProps {
  username: string;
  avatarColor: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  avatarColor,
  avatarUrl,
  size = 36,
  className = '',
}) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  const fontSize = Math.max(10, Math.floor(size * 0.4));

  return (
    <div
      style={{ width: size, height: size, backgroundColor: avatarColor, fontSize }}
      className={`rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none ${className}`}
    >
      {initialsFor(username)}
    </div>
  );
};
