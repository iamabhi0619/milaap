'use client';

import React, { useEffect, useState } from 'react';
import { IconMicrophone, IconPlayerStop, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecordButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  disabled?: boolean;
}

export const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  disabled,
}) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-full animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">
            {formatDuration(duration)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelRecording}
            className="h-8 w-8 rounded-full hover:bg-destructive/20"
          >
            <IconTrash className="h-4 w-4 text-destructive" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStopRecording}
            className="h-8 w-8 rounded-full hover:bg-primary/20"
          >
            <IconPlayerStop className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onStartRecording}
      disabled={disabled}
      className={cn(
        "h-9 w-9 rounded-full transition-all duration-200",
        "hover:bg-primary/10 hover:text-primary",
        "active:scale-95"
      )}
    >
      <IconMicrophone className="h-5 w-5" />
    </Button>
  );
};
