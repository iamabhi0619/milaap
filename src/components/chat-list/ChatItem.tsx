import React from 'react';
import { cn } from '@/lib/utils';
import { ChatAvatar } from './ChatAvatar';
import { ChatInfo } from './ChatInfo';
import { Card } from '@/components/ui/card';

interface ChatItemProps {
  chatId: string;
  displayName: string;
  avatar?: string | null;
  isGroup: boolean;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  isActive: boolean;
  unreadCount?: number;
  onClick: (chatId: string) => void;
}

export function ChatItem({
  chatId,
  displayName,
  avatar,
  isGroup,
  lastMessage,
  lastMessageAt,
  isActive,
  unreadCount,
  onClick,
}: ChatItemProps) {
  return (
    <Card
      onClick={() => onClick(chatId)}
      className={cn(
        'group relative flex flex-row gap-3 p-3 cursor-pointer transition-all duration-200 border',
        'hover:bg-accent/50 hover:shadow-md hover:border-primary/20',
        'active:scale-[0.98]',
        isActive
          ? 'bg-accent/50 shadow-md border-primary/30'
          : 'bg-card border-border/50 hover:border-border'
      )}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-r-full shadow-sm" />
      )}

      <ChatAvatar
        avatar={avatar}
        displayName={displayName}
        isGroup={isGroup}
        isActive={isActive}
      />

      <ChatInfo
        displayName={displayName}
        lastMessage={lastMessage}
        lastMessageAt={lastMessageAt}
        isActive={isActive}
        unreadCount={unreadCount}
      />

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-lg bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}
