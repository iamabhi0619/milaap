import { Message } from "../table";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface MessageStore {
    loading: boolean;
    error: string | null;
    isGroup: boolean;
    messages: Message[];
    selectedChatId: string | null;
    hasMore: boolean;
    realtimeChannel: RealtimeChannel | null;
    selectChat: (chatId: string) => void;
    unselectChat: () => void;
    clearMessages: () => void;
    loadMessages: (chatId: string, before?: string) => Promise<void>;
    listenForNewMessages: (chatId: string) => void;
    stopListening: () => void;
    sendMessage: (message: Message) => void;
}
