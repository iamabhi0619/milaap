import React from 'react';

interface RecordingTimerProps {
    duration: number;
}

const RecordingTimer = ({ duration }: RecordingTimerProps) => {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-sm font-mono font-semibold tabular-nums">
            {formatDuration(duration)}
        </div>
    );
};

export default RecordingTimer;
