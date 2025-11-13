import React from 'react';
import { cn } from '@/lib/utils';
import moment from 'moment';

interface ChatInfoProps {
  displayName: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  isActive: boolean;
  unreadCount?: number;
}

export function ChatInfo({
  displayName,
  lastMessage,
  lastMessageAt,
  isActive,
  unreadCount = 0,
}: ChatInfoProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3
          className={cn(
            'font-semibold text-sm truncate transition-colors',
            isActive ? 'text-foreground' : 'text-foreground/90 group-hover:text-foreground'
          )}
        >
          {displayName}
        </h3>
        <div className="flex items-center gap-2">

        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {lastMessage && (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          </div>
        )}
        {unreadCount > 0 && (
          <span className="shrink-0 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {lastMessageAt && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {moment(lastMessageAt).isSame(new Date(), 'day')
              ? moment(lastMessageAt).fromNow()
              : moment(lastMessageAt).format('DD/MM/YYYY')}
          </span>
        )}
      </div>
    </div>
  );
}
