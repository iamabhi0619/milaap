import React from 'react';
import { cn } from '@/lib/utils';

interface RecordingIndicatorProps {
    isActive: boolean;
}

const RecordingIndicator = ({ isActive }: RecordingIndicatorProps) => {
    return (
        <div className="relative flex items-center justify-center w-8 h-8">
            {isActive && (
                <div className="absolute inset-0 rounded-full bg-destructive/40 animate-ping" />
            )}
            <div 
                className={cn(
                    "relative w-3 h-3 rounded-full transition-colors duration-300",
                    isActive ? "bg-destructive shadow-lg shadow-destructive/50" : "bg-muted-foreground"
                )}
            />
        </div>
    );
};

export default RecordingIndicator;
