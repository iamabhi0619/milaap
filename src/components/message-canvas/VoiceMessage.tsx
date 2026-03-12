"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconLoader3, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";

interface VoiceMessageProps {
  voiceUrl: string;
  isOwn?: boolean;
}

// Static waveform bar heights — gives a natural look
const WAVEFORM_BARS = [3, 5, 8, 6, 10, 7, 12, 9, 14, 10, 8, 13, 11, 15, 9, 7, 12, 10, 8, 6, 9, 11, 7, 5, 4];

const VoiceMessage: React.FC<VoiceMessageProps> = ({ voiceUrl, isOwn = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!voiceUrl) {
      setError(true);
      setIsLoading(false);
      return;
    }

    const audio = new Audio();
    audio.preload = "metadata";

    const handleCanPlay = () => { setIsLoading(false); setError(false); };
    const handleError = () => { setError(true); setIsLoading(false); };
    const handleLoadedMetadata = () => { setAudioDuration(audio.duration || 0); };
    const handleTimeUpdate = () => { setAudioProgress(audio.currentTime); };
    const handleEnded = () => { setIsPlaying(false); setAudioProgress(0); };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    try {
      audio.src = voiceUrl;
      audio.load();
      audioRef.current = audio;
    } catch {
      setError(true);
      setIsLoading(false);
    }

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.src = "";
    };
  }, [voiceUrl]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setError(true);
    }
  };

  const togglePlaybackSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const speeds = [1, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    audio.playbackRate = nextSpeed;
    setPlaybackRate(nextSpeed);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration || isLoading || error) return;
    const rect = progressBarRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audioDuration;
    setAudioProgress(ratio * audioDuration);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressRatio = audioDuration > 0 ? audioProgress / audioDuration : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200",
        "min-w-55 max-w-75",
        isOwn
          ? "bg-primary/15 border border-primary/25"
          : "bg-muted/60 border border-border/40"
      )}
    >
      {/* Play / Pause button */}
      <Button
        variant="ghost"
        size="icon"
        disabled={isLoading || error}
        onClick={togglePlayPause}
        className={cn(
          "h-9 w-9 rounded-full shrink-0 transition-all duration-200",
          isOwn
            ? "bg-primary text-primary-foreground hover:bg-primary/85 shadow-sm shadow-primary/30"
            : "bg-foreground/10 text-foreground hover:bg-foreground/20",
          (isLoading || error) && "opacity-50 cursor-not-allowed",
          isPlaying && "scale-95"
        )}
      >
        {isLoading ? (
          <IconLoader3 className="h-4 w-4 animate-spin" />
        ) : error ? (
          <IconAlertCircle className="h-4 w-4 text-destructive" />
        ) : isPlaying ? (
          <IconPlayerPause className="h-4 w-4 fill-current" />
        ) : (
          <IconPlayerPlay className="h-4 w-4 fill-current ml-0.5" />
        )}
      </Button>

      {/* Waveform + meta */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {/* Waveform bars */}
        <div
          ref={progressBarRef}
          onClick={handleWaveformClick}
          className={cn(
            "flex items-center gap-px h-8",
            !error && !isLoading && audioDuration ? "cursor-pointer" : "cursor-default"
          )}
        >
          {error ? (
            <span className="text-xs text-destructive/80">Unable to play audio</span>
          ) : (
            WAVEFORM_BARS.map((height, i) => {
              const barRatio = i / (WAVEFORM_BARS.length - 1);
              const isActive = barRatio <= progressRatio;
              return (
                <div
                  key={i}
                  style={{ height: `${height * 2}px` }}
                  className={cn(
                    "w-1 rounded-full shrink-0 transition-all duration-100",
                    isLoading
                      ? "bg-muted-foreground/25 animate-pulse"
                      : isActive
                        ? isOwn
                          ? "bg-primary"
                          : "bg-foreground/70"
                        : isOwn
                          ? "bg-primary/25"
                          : "bg-foreground/20",
                    isPlaying && isActive && "scale-y-110"
                  )}
                />
              );
            })
          )}
        </div>

        {/* Time + speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-[11px] font-mono tabular-nums">
              {formatTime(isPlaying ? audioProgress : audioDuration)}
            </span>
          </div>

          {!error && !isLoading && (
            <button
              onClick={togglePlaybackSpeed}
              className={cn(
                "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md transition-all",
                isOwn
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"
              )}
            >
              {playbackRate}×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;
