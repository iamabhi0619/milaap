'use client';

import React from 'react';
import { IconX, IconPhoto } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReplyMessage } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReplyPreviewProps {
  replyTo: ReplyMessage | null;
  onCancel: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  replyTo,
  onCancel,
}) => {
  if (!replyTo) return null;

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={replyTo.senderAvatar} alt={replyTo.senderName} />
          <AvatarFallback>
            {replyTo.senderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-primary mb-1">
            {replyTo.senderName}
          </div>
          <div className="flex items-center gap-2">
            {replyTo.imageUrl && (
              <div className="shrink-0 w-10 h-10 rounded overflow-hidden bg-muted">
                <img
                  src={replyTo.imageUrl}
                  alt="Replied image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className={cn(
              "text-sm text-muted-foreground line-clamp-2",
              !replyTo.text && replyTo.imageUrl && "flex items-center gap-1"
            )}>
              {replyTo.text || (
                <>
                  <IconPhoto className="h-4 w-4" />
                  <span>Photo</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-6 w-6 rounded-full shrink-0"
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
