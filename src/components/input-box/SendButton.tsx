'use client';

import React from 'react';
import { IconSend } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SendButtonProps {
  onSend: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  hasContent?: boolean;
}

export const SendButton: React.FC<SendButtonProps> = ({
  onSend,
  disabled,
  isLoading,
  hasContent,
}) => {
  return (
    <Button
      onClick={onSend}
      disabled={disabled || !hasContent}
      size="icon"
      className={cn(
        "h-9 w-9 rounded-full transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        hasContent 
          ? "bg-primary text-primary-foreground shadow-lg" 
          : "bg-muted text-muted-foreground"
      )}
    >
      <IconSend 
        className={cn(
          "h-5 w-5 transition-transform",
          isLoading && "animate-spin"
        )} 
      />
    </Button>
  );
};
