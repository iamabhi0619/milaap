import { create } from 'zustand';
import useMessageBoxStore from '../messangingStore';

type RecordingState = 'idle' | 'recording' | 'paused';

interface VoiceRecordingStore {
    recordingState: RecordingState;
    isRecording: boolean;
    audioBlob: Blob | null;
    audioUrl: string | null;
    duration: number;
    mediaRecorder: MediaRecorder | null;
    mediaStream: MediaStream | null;
    timerInterval: NodeJS.Timeout | null;

    startRecording: () => Promise<void>;
    stopRecording: () => void;
    cancelRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    resetState: () => void;
    updateDuration: () => void;
}

const useVoiceRecordingStore = create<VoiceRecordingStore>((set, get) => ({
    recordingState: 'idle',
    isRecording: false,
    audioBlob: null,
    audioUrl: null,
    duration: 0,
    mediaRecorder: null,
    mediaStream: null,
    timerInterval: null,

    startRecording: async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                set({ audioBlob, audioUrl });
            };

            recorder.start();

            const interval = setInterval(() => {
                get().updateDuration();
            }, 100);

            set({
                mediaRecorder: recorder,
                mediaStream: stream,
                recordingState: 'recording',
                isRecording: true,
                duration: 0,
                timerInterval: interval,
            });
        } catch (error) {
            alert('Unable to access microphone. Please grant permission and try again.');
        }
    },

    stopRecording: () => {
        const { timerInterval, mediaRecorder, isRecording, audioBlob } = get();

        if (!isRecording) return;

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();

            mediaRecorder.addEventListener('stop', () => {
                const { audioBlob } = get();
                if (audioBlob) {
                    const { setVoiceRecording } = useMessageBoxStore.getState();
                    setVoiceRecording(audioBlob);
                }
            }, { once: true });
        }

        set({
            recordingState: 'idle',
            isRecording: false,
            timerInterval: null,
        });
    },

    cancelRecording: () => {
        const { timerInterval, mediaRecorder, audioUrl, isRecording, mediaStream } = get();

        if (!isRecording) return;

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        set({
            recordingState: 'idle',
            isRecording: false,
            audioBlob: null,
            audioUrl: null,
            duration: 0,
            timerInterval: null,
            mediaRecorder: null,
            mediaStream: null,
        });
    },

    pauseRecording: () => {
        const { timerInterval, mediaRecorder } = get();

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
        }

        set({
            recordingState: 'paused',
            timerInterval: null,
        });
    },

    resumeRecording: () => {
        const { mediaRecorder } = get();

        if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
        }

        const interval = setInterval(() => {
            get().updateDuration();
        }, 100);

        set({
            recordingState: 'recording',
            timerInterval: interval,
        });
    },

    resetState: () => {
        const { timerInterval, mediaRecorder, mediaStream, audioUrl } = get();

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        set({
            recordingState: 'idle',
            isRecording: false,
            audioBlob: null,
            audioUrl: null,
            duration: 0,
            timerInterval: null,
            mediaRecorder: null,
            mediaStream: null,
        });
    },

    updateDuration: () => {
        set((state) => ({
            duration: state.duration + 0.1,
        }));
    },
}));

export default useVoiceRecordingStore;
