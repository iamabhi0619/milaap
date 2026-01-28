import { fileUpload, SupabaseUploadResult } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { sendMessage, SendMessageOptions } from "@/lib/utils/send-message";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { create } from "zustand";

export interface AttachmentWithMetadata extends SupabaseUploadResult {
    name: string;
    size: number;
}

interface MessagingStore {
    text?: string;
    attachments?: Array<AttachmentWithMetadata>;
    isSending: boolean;
    error: string | null;
    voiceRecordingUrl?: string;
    fileUploadProgress: Record<string, number>;
    addAttachment: (files: File[]) => Promise<void>;
    removeAttachment: (id: string) => void;
    setText: (text: string) => void;
    sendMessage: () => Promise<void>;
    setVoiceRecording: (blob: Blob) => void;
}

const useMessageBoxStore = create<MessagingStore>((set, get) => ({
    isSending: false,
    error: null,
    fileUploadProgress: {},
    voiceRecordingUrl: undefined,

    setText: (text) => set({ text }),

    addAttachment: async (files) => {
        set({ fileUploadProgress: {} });
        const uploadedFiles: Array<AttachmentWithMetadata> = [];

        for (const file of files) {
            const fileId = `${file.name}-${Date.now()}`;

            // Upload file with progress tracking
            const result = await fileUpload(file, {
                onProgress: (progress: number) => {
                    set((state) => ({
                        fileUploadProgress: {
                            ...state.fileUploadProgress,
                            [fileId]: progress,
                        },
                    }));
                },
            });

            // Add file metadata to the result
            uploadedFiles.push({
                ...result,
                name: file.name,
                size: file.size,
            });
        }

        set((state) => ({
            attachments: [...(state.attachments || []), ...uploadedFiles],
            fileUploadProgress: {},
        }));
    },

    removeAttachment: (id) => {
        set((state) => ({
            attachments: state.attachments?.filter((att) => att.id !== id),
        }));
    },

    setVoiceRecording: async (blob) => {
        const fileName = `recording-${Date.now()}.webm`;
        const path = `${fileName}`;
        
        const { data: uploadData, error } = await supabase.storage
            .from('attachment')
            .upload(path, blob, {
                contentType: 'audio/webm',
                upsert: false,
            });

        if (error) {
            toast.error('Failed to upload voice recording: ' + error.message);
            set({ error: error.message });
            return;
        }

        
        const { data } = supabase.storage
            .from('attachment')
            .getPublicUrl(path);

        if (!data || !data.publicUrl) {
            toast.error('Failed to get public URL for voice recording.');
            set({ error: 'Failed to get public URL for voice recording.' });
            return;
        }

        set({ voiceRecordingUrl: data.publicUrl });
        
        const { sendMessage } = get();
        await sendMessage();
    },

    sendMessage: async () => {
        const { text, attachments, voiceRecordingUrl } = get();

        if (!text && (!attachments || attachments.length === 0) && !voiceRecordingUrl) {
            set({ error: 'Message cannot be empty' });
            return;
        }

        set({ isSending: true, error: null });

        try {
            const { selectedChatId } = useMessageStore.getState();
            if (!selectedChatId) {
                toast.error('No chat selected');
                set({ isSending: false });
                return;
            }
            const { user } = useUserStore.getState();
            if (!user?.id) {
                toast.error('User not authenticated');
                set({ isSending: false });
                return;
            }
            const payload: SendMessageOptions = {
                text: text || null,
                chat_id: selectedChatId,
                sender_id: user.id,
                attachments: (attachments || []).map(att => ({
                    url: att.url,
                    type: att.type ?? "file",
                    name: att.name,
                })),
                voice_url: voiceRecordingUrl || null,
            }
            await sendMessage(payload)
            console.log('Sending message:', { text, attachments, voiceRecordingUrl });

            // Clear the message after sending
            set({ text: '', attachments: [], voiceRecordingUrl: undefined, isSending: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to send message',
                isSending: false
            });
        }
    },
}));

export default useMessageBoxStore;