'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
    mediaStream: MediaStream | null;
    isActive: boolean;
}

const AudioWaveform = ({ mediaStream, isActive }: AudioWaveformProps) => {
    const [bars, setBars] = useState<number[]>(Array(25).fill(20));
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isActive || !mediaStream) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
            }
            setBars(Array(25).fill(20));
            return;
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(mediaStream);
        
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        analyser.minDecibels = -100;
        analyser.maxDecibels = -30;
        
        microphone.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateWaveform = () => {
            if (!analyserRef.current) return;
            
            analyserRef.current.getByteFrequencyData(dataArray);
            
            const barCount = 25;
            const newBars: number[] = [];
            
            for (let i = 0; i < barCount; i++) {
                const start = Math.floor((i * bufferLength) / barCount);
                const end = Math.floor(((i + 1) * bufferLength) / barCount);
                
                let sum = 0;
                for (let j = start; j < end; j++) {
                    sum += dataArray[j];
                }
                const average = sum / (end - start);
                
                // Convert to percentage (20-100%)
                const percentage = 20 + (average / 255) * 80;
                newBars.push(percentage);
            }
            
            setBars(newBars);
            animationFrameRef.current = requestAnimationFrame(updateWaveform);
        };

        updateWaveform();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
            }
        };
    }, [isActive, mediaStream]);

    return (
        <div className="flex items-center justify-center gap-1 flex-1 h-12 px-2">
            {bars.map((height, index) => {
                return (
                    <div
                        key={index}
                        className={cn(
                            "flex-1 rounded-full transition-all duration-75 ease-linear",
                            isActive ? "bg-primary/80" : "bg-muted-foreground/30"
                        )}
                        style={{
                            height: `${height}%`,
                            minHeight: '20%',
                            maxHeight: '100%',
                        }}
                    />
                );
            })}
        </div>
    );
};

export default AudioWaveform;
