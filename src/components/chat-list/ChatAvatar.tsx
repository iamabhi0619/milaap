import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatAvatarProps {
  avatar?: string | null;
  displayName: string;
  isGroup: boolean;
  isActive: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function ChatAvatar({ avatar, displayName, isGroup, isActive }: ChatAvatarProps) {
  return (
    <div className="relative">
      <Avatar
        className={cn(
          'h-12 w-12 border-2 transition-all duration-200',
          isActive ? 'border-primary' : 'border-transparent group-hover:border-primary/30'
        )}
      >
        <AvatarImage src={avatar || undefined} alt={displayName} />
        <AvatarFallback
          className={cn(
            'text-sm font-semibold text-white',
            isGroup
              ? 'bg-linear-to-br from-purple-500 to-pink-500'
              : 'bg-linear-to-br from-blue-500 to-cyan-500'
          )}
        >
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      {isGroup && (
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border shadow-sm">
          <Users className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
