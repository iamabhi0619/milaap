"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, Play, Pause, Volume2 } from "lucide-react";

interface VoiceMessageProps {
  voiceUrl: string;
  isOwn?: boolean;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ voiceUrl, isOwn = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const timeUpdate = () => setAudioProgress(audioEl.currentTime);
    const loaded = () => setAudioDuration(audioEl.duration || 0);
    const ended = () => setIsPlaying(false);

    audioEl.addEventListener("timeupdate", timeUpdate);
    audioEl.addEventListener("loadedmetadata", loaded);
    audioEl.addEventListener("ended", ended);

    return () => {
      audioEl.removeEventListener("timeupdate", timeUpdate);
      audioEl.removeEventListener("loadedmetadata", loaded);
      audioEl.removeEventListener("ended", ended);
    };
  }, []);

  const togglePlayPause = () => {
    const audioEl = audioRef.current;
    if (!audioEl) {
      const a = new Audio(voiceUrl);
      a.play();
      audioRef.current = a;
      setIsPlaying(true);
      a.addEventListener("timeupdate", () => setAudioProgress(a.currentTime));
      a.addEventListener("loadedmetadata", () => setAudioDuration(a.duration || 0));
      a.addEventListener("ended", () => setIsPlaying(false));
      return;
    }

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      audioEl.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <Card className={cn(
        "border-2 transition-all duration-200",
        isOwn ? "bg-primary/5 border-primary/20 hover:border-primary/40" : "bg-muted/50 border-border/30 hover:border-border"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full shrink-0",
                isPlaying 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-primary/10 hover:bg-primary/20"
              )}
              onClick={togglePlayPause}
            >
              {isPlaying ? 
                <Pause className="h-4 w-4" /> : 
                <Play className="h-4 w-4 ml-0.5" />
              }
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Voice Message</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {audioDuration ? Math.ceil(audioDuration) + "s" : "—"}
                </Badge>
              </div>
              <Progress 
                value={audioDuration ? (audioProgress / Math.max(audioDuration, 1)) * 100 : 0} 
                className="h-1.5 rounded-full"
              />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <a href={voiceUrl} download>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      <audio ref={audioRef} hidden />
    </>
  );
};

export default VoiceMessage;
