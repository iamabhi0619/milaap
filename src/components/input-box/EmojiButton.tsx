'use client';

import React from 'react';
import { IconMoodSmile } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EmojiButton: React.FC<EmojiButtonProps> = ({
  onEmojiSelect,
  disabled,
  isOpen,
  onOpenChange,
}) => {
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            "h-9 w-9 rounded-full transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary",
            "active:scale-95",
            isOpen && "bg-primary/10 text-primary"
          )}
        >
          <IconMoodSmile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-auto p-0 border-0"
        sideOffset={8}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={false}
          width={320}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};
