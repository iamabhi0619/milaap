import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatScrollArea({ children, className }: ChatScrollAreaProps) {
  return (
    <ScrollArea className={cn('flex-1 h-full bg-red-300', className)}>
      <div className="flex flex-col gap-1 p-2 bg-accent">{children}</div>
    </ScrollArea>
  );
}
