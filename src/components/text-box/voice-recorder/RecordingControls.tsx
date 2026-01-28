import React from 'react';
import { Button } from '@/components/ui/button';
import { IconTrash, IconSend, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

interface RecordingControlsProps {
    isPaused: boolean;
    onPauseResume: () => void;
    onCancel: () => void;
    onSend: () => void;
}

const RecordingControls = ({ isPaused, onPauseResume, onCancel, onSend }: RecordingControlsProps) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                onClick={onPauseResume}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/10"
            >
                {isPaused ? (
                    <IconPlayerPlay className="size-4" />
                ) : (
                    <IconPlayerPause className="size-4" />
                )}
            </Button>

            <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-destructive/20"
            >
                <IconTrash className="size-4 text-destructive" />
            </Button>

            <Button
                type="button"
                onClick={onSend}
                size="icon"
                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
            >
                <IconSend className="size-5" />
            </Button>
        </div>
    );
};

export default RecordingControls;
