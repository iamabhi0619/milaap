import { create } from "zustand";
import { MessageStore } from "@/types/store/message";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types/table";
import { sendMessage } from "@/lib/utils/send-message";


export const useMessageStore = create<MessageStore>((set, get) => ({
    loading: false,
    error: null,
    messages: [],
    selectedChatId: null,
    hasMore: true,
    isGroup: false,
    realtimeChannel: null,

    // 🟢 Select Chat
    selectChat: async (chatId) => {
        const chat = await supabase
            .from("chats")
            .select("is_group")
            .eq("id", chatId)
            .single();

        if (chat.error) {
            console.error("Error fetching chat info:", chat.error);
            return;
        }
        set({ isGroup: chat.data.is_group });
        const { stopListening, listenForNewMessages, clearMessages, loadMessages } = get();
        stopListening(); // stop old chat realtime
        clearMessages();
        set({ selectedChatId: chatId, hasMore: true });
        listenForNewMessages(chatId);
        loadMessages(chatId, undefined);
    },

    unselectChat: () => {
        const { stopListening } = get();
        stopListening();
        set({ selectedChatId: null, messages: [], hasMore: false });
    },

    clearMessages: () => set({ messages: [], hasMore: false }),

    loadMessages: async (chatId, before) => {
        console.log("Called me..!! why..!")
        try {
            if (get().selectedChatId && get().selectedChatId !== chatId) {
                set({ messages: [] });
            }
            set({ loading: true, error: null });

            let query = supabase
                .from("messages")
                .select(
                    `id, chat_id, sender_id, text, image_url, voice_url, created_at, attachments(id, file_url, file_type, file_name, created_at) ${get().isGroup ? ', sender:users!sender_id(id, name, avatar)' : ''}`
                )
                .eq("chat_id", chatId)
                .order("created_at", { ascending: false })
                .limit(20);

            if (before) query = query.lt("created_at", before);

            const { data, error } = await query;

            if (error) throw error;

            if (!data || data.length === 0) {
                set({ hasMore: false, loading: false });
                return;
            }

            const prev = get().messages;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const reversedData = (data as any).reverse();

            // Filter out duplicates by checking message IDs
            const existingIds = new Set(prev.map(m => m.id));
            const newMessages = reversedData.filter((msg: Message) => !existingIds.has(msg.id));

            // If we got fewer messages than the limit (20), there are no more messages
            const hasMoreMessages = data.length === 20;

            // add older messages to top
            set({
                messages: [...newMessages, ...prev],
                loading: false,
                hasMore: hasMoreMessages,
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Error loading messages:", err.message);
            set({ error: err.message, loading: false });
        }
    },

    listenForNewMessages: (chatId) => {
        console.log("Called me to why...!")
        const channel = supabase
            .channel(`chat:${chatId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${chatId}`,
                },
                async (payload) => {
                    const newMessage = payload.new as Message;

                    // Fetch the complete message with sender info to avoid duplicates
                    const { data } = await supabase
                        .from("messages")
                        .select("id, chat_id, sender_id, text, image_url, voice_url, created_at, attachments(id, file_url, file_type, created_at), sender:users!sender_id(id, name, avatar)")
                        .eq("id", newMessage.id)
                        .single();

                    if (data) {
                        set((state) => {
                            // Check if message already exists to prevent duplicates
                            const exists = state.messages.some(m => m.id === data.id);
                            if (exists) return state;

                            return {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                messages: [...state.messages, data as any],
                            };
                        });
                    }
                }
            )
            .subscribe();

        set({ realtimeChannel: channel });
    },

    // 🔴 Stop realtime subscription (when switching chats)
    stopListening: () => {
        const { realtimeChannel } = get();
        if (realtimeChannel) supabase.removeChannel(realtimeChannel);
        set({ realtimeChannel: null });
    },

    sendMessage: async (message: Message) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const _sentMessage = await sendMessage(message as any);
        // if (sentMessage) {
        //     set((state) => ({
        //         messages: [...state.messages, sentMessage as any],
        //     }));
        // }
    },
}));
