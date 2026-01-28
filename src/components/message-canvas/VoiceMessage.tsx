"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Play, Pause, Mic2, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VoiceMessageProps {
  voiceUrl: string;
  isOwn?: boolean;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ voiceUrl, isOwn = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Initialize audio element
  useEffect(() => {
    if (!voiceUrl) {
      setError(true);
      setIsLoading(false);
      return;
    }

    const audio = new Audio();
    audio.preload = "metadata";

    // Try without crossOrigin first for same-origin URLs
    // audio.crossOrigin = "anonymous";

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(false);
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Set source and load
    try {
      audio.src = voiceUrl;
      audio.load();
      audioRef.current = audio;
    } catch (err) {
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
    } catch (err) {
      setError(true);
    }
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;

    const newTime = (value[0] / 100) * audioDuration;
    audio.currentTime = newTime;
    setAudioProgress(newTime);
  };

  const togglePlaybackSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

    audio.playbackRate = nextSpeed;
    setPlaybackRate(nextSpeed);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0;

  return (
    <div className={cn(
      "relative rounded-2xl p-4 transition-all duration-300 shadow-sm",
      "border backdrop-blur-sm",
      isOwn
        ? "bg-linear-to-br from-primary/10 via-primary/5 to-transparent border-primary/20"
        : "bg-linear-to-br from-muted/50 via-muted/30 to-transparent border-border/40",
      "hover:shadow-md hover:scale-[1.01]"
    )}>
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading || error}
          className={cn(
            "h-12 w-12 rounded-full shrink-0 transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            isPlaying
              ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105"
              : error
                ? "bg-destructive/20 text-destructive cursor-not-allowed"
                : "bg-primary/90 text-primary-foreground hover:bg-primary",
          )}
          onClick={togglePlayPause}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : error ? (
            <Mic2 className="h-5 w-5" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        {/* Audio Info & Progress */}
        <div className="flex-1 min-w-[250px] w-full space-y-2">
          <div className="flex items-end w-full justify-end gap-2">
            {/* <div className="flex items-center gap-2">
              <Mic2 className={cn(
                "h-4 w-4 transition-colors",
                isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"
              )} />
              <span className="text-xs font-semibold text-foreground/80">
                {error ? "Unable to play audio" : "Voice Message"}
              </span>
            </div> */}

            <div className="flex items-center gap-2">
              {!error && !isLoading && (
                <Button
                  size="sm"
                  className="h-6 px-2 text-xs font-mono"
                  onClick={togglePlaybackSpeed}
                >
                  {playbackRate}x
                </Button>
              )}
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {formatTime(audioProgress)} / {formatTime(audioDuration)}
              </span>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="relative">
            <Slider
              value={[progressPercentage]}
              onValueChange={handleProgressChange}
              disabled={isLoading || error || !audioDuration}
              max={100}
              step={0.1}
              className={cn(
                "cursor-pointer",
                (isLoading || error) && "opacity-50 cursor-not-allowed"
              )}
            />
            {isPlaying && (
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary/20 rounded-full transition-all duration-100"
                style={{
                  width: `${progressPercentage}%`,
                  left: 0
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;
