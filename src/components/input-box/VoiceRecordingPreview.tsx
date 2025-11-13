'use client';

import React, { useRef, useState, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { VoiceRecording } from './types';

interface VoiceRecordingPreviewProps {
  recording: VoiceRecording | null;
  onRemove: () => void;
}

export const VoiceRecordingPreview: React.FC<VoiceRecordingPreviewProps> = ({
  recording,
  onRemove,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (recording && audioRef.current) {
      audioRef.current.src = recording.url;
      setDuration(recording.duration);
    }
  }, [recording]);

  if (!recording) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
        >
          {isPlaying ? (
            <IconPlayerPause className="h-5 w-5 text-primary" />
          ) : (
            <IconPlayerPlay className="h-5 w-5 text-primary" />
          )}
        </Button>

        <div className="flex-1">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 rounded-full hover:bg-destructive/20"
        >
          <IconTrash className="h-4 w-4 text-destructive" />
        </Button>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="hidden"
        />
      </div>
    </div>
  );
};
