'use client';

import React from 'react';
import { Button } from '../ui/button';
import { IconMicrophone } from '@tabler/icons-react';
import useVoiceRecordingStore from './voice-recorder/voiceRecordingStore';
import { cn } from '@/lib/utils';
import AudioWaveform from './voice-recorder/AudioWaveform';
import RecordingTimer from './voice-recorder/RecordingTimer';
import RecordingIndicator from './voice-recorder/RecordingIndicator';
import RecordingControls from './voice-recorder/RecordingControls';

const VoiceRecorder = () => {
    const {
        isRecording,
        duration,
        recordingState,
        mediaStream,
        startRecording,
        stopRecording,
        cancelRecording,
        pauseRecording,
        resumeRecording,
    } = useVoiceRecordingStore();

    if (!isRecording) {
        return (
            <Button
                onClick={startRecording}
                className="h-12 w-12 rounded-full"
                variant="outline"
                type="button"
            >
                <IconMicrophone className="size-5" />
            </Button>
        );
    }

    const isActive = recordingState !== 'paused';

    return (
        <div className="flex items-center gap-3 w-full">
            <div className={cn(
                "flex items-center gap-4 flex-1 rounded-2xl border-2 px-4 py-0.5",
                "bg-linear-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border-primary/40",
                "transition-all duration-300"
            )}>
                <RecordingIndicator isActive={isActive} />

                <RecordingTimer duration={duration} />

                <AudioWaveform
                    mediaStream={mediaStream}
                    isActive={isActive}
                />

                <RecordingControls
                    isPaused={recordingState === 'paused'}
                    onPauseResume={() => recordingState === 'paused' ? resumeRecording() : pauseRecording()}
                    onCancel={cancelRecording}
                    onSend={stopRecording}
                />
            </div>
        </div>
    );
};

export default VoiceRecorder;