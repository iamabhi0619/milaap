import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  onNewChat?: () => void;
}

export function EmptyState({ onNewChat }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Card className="flex flex-col items-center justify-center p-8 text-center max-w-md border-dashed border-2">
        <div className="rounded-full bg-muted p-6 mb-4 relative">
          <MessageCircle className="h-12 w-12 text-muted-foreground" />
          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
            <Plus className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No chats yet</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          Start a conversation with someone to see your chats here
        </p>
        {onNewChat && (
          <Button onClick={onNewChat} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Start New Chat
          </Button>
        )}
      </Card>
    </div>
  );
}
