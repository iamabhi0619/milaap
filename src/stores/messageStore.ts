import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Message, MessageStoreState } from "@/types/types";

export const useMessageStore = create<MessageStoreState>((set, get) => ({
  messages: [],

  fetchMessages: async (chatId) => {
    if (!chatId) return; // Ensure chatId is provided
    set({ messages: [] });

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    set({ messages });
  },

  sendMessage: async (
    text: string | undefined,
    image_url: string | undefined,
    voice_url: string | undefined
  ) => {
    const chatId = get().chatId; // Use chatId from the store
    const userId = "some_user_id"; // Replace with actual user ID logic

    if (!chatId || !userId) return;

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          sender_id: userId,
          text,
          image_url,
          voice_url,
          edited: false,
          deleted: false,
          seen_by: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    set((state) => ({
      messages: [...state.messages, data],
    }));
  },

  markAsRead: async () => {
    const chatId = "some_chat_id"; // Replace with actual logic
    const userId = "some_user_id"; // Replace with actual logic

    if (!chatId || !userId) return;

    const { messages } = get();
    const unseenMessages = messages.filter(
      (msg) => msg.sender_id !== userId && !msg.seen_by.includes(userId)
    );

    if (unseenMessages.length === 0) return;

    for (const msg of unseenMessages) {
      await supabase
        .from("messages")
        .update({
          seen_by: [...msg.seen_by, userId],
        })
        .eq("id", msg.id);
    }

    set({
      messages: messages.map((msg) =>
        msg.sender_id !== userId && !msg.seen_by.includes(userId)
          ? { ...msg, seen_by: [...msg.seen_by, userId] }
          : msg
      ),
    });
  },

  handleMessageUpdates: () => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            chat_id: payload.new.chat_id,
            sender_id: payload.new.sender_id,
            text: payload.new.text,
            image_url: payload.new.image_url,
            voice_url: payload.new.voice_url,
            edited: payload.new.edited,
            deleted: payload.new.deleted,
            seen_by: payload.new.seen_by,
            created_at: payload.new.created_at,
          };
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  },

  resetMessages: () => {
    set({ messages: [] });
  },
}));
