'use client';

import React, { useRef } from 'react';
import { IconPaperclip, IconPhoto, IconFile, IconVideo, IconCamera, IconMusic } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AttachmentButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AttachmentButton: React.FC<AttachmentButtonProps> = ({
  onFileSelect,
  disabled,
  isOpen,
  onOpenChange,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onOpenChange?.(false);
      e.target.value = '';
    }
  };

  const attachmentOptions = [
    {
      icon: IconPhoto,
      label: 'Photo',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      onClick: () => imageInputRef.current?.click(),
      accept: 'image/*',
      ref: imageInputRef,
    },
    {
      icon: IconVideo,
      label: 'Video',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      onClick: () => videoInputRef.current?.click(),
      accept: 'video/*',
      ref: videoInputRef,
    },
    {
      icon: IconMusic,
      label: 'Audio',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      onClick: () => audioInputRef.current?.click(),
      accept: 'audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac',
      ref: audioInputRef,
    },
    {
      icon: IconCamera,
      label: 'Camera',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      onClick: () => cameraInputRef.current?.click(),
      accept: 'image/*',
      capture: true,
      ref: cameraInputRef,
    },
    {
      icon: IconFile,
      label: 'Document',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
      onClick: () => documentInputRef.current?.click(),
      accept: '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx,.zip,.rar',
      ref: documentInputRef,
    },
  ];

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
          <IconPaperclip className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-56 p-2"
        sideOffset={8}
      >
        <div className="grid grid-cols-2 gap-2">
          {attachmentOptions.map((option) => (
            <div key={option.label}>
              <Button
                variant="ghost"
                onClick={option.onClick}
                disabled={disabled}
                className={cn(
                  "w-full h-auto flex flex-col items-center gap-2 p-3",
                  "transition-all duration-200",
                  option.bgColor,
                  "active:scale-95"
                )}
              >
                <option.icon className={cn("h-6 w-6", option.color)} />
                <span className="text-xs font-medium">{option.label}</span>
              </Button>
              <input
                ref={option.ref}
                type="file"
                accept={option.accept}
                onChange={handleFileChange}
                className="hidden"
                capture={option.capture ? 'environment' : undefined}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
