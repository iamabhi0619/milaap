import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Message, MessageStoreState } from "@/types/types";
import { useUserStore } from "./userStoretemp";

export const useMessageStore = create<MessageStoreState>((set, get) => ({
  messages: [],

  fetchMessages: async (chatId) => {
    if (!chatId) return;
    set({ messages: [] });
    const userId = useUserStore.getState().user?.id;

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

    // Mark messages as read after fetching
    if (userId) await get().markAsRead(chatId);
  },

  sendMessage: async (text, image_url, voice_url) => {
    const chatId = get().messages[0]?.chat_id;
    const userId = useUserStore.getState().user?.id;

    if (!chatId || !userId) {
      console.error("Chat ID or User ID is missing. Cannot send message.");
      return;
    }
    try {
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
        messages: [...state.messages],
      }));
      await supabase.from("chats").update({ latest_message: data.id }).eq("id", chatId);
    } catch (err) {
      console.error("Unexpected error while sending message:", err);
    }
  },

  markAsRead: async (chatId: string) => {
    if (!chatId) return;
    const userId = useUserStore.getState().user?.id;
    if (!userId) return;

    const { messages } = get();
    const unseenMessages = messages.filter(
      (msg) => msg.sender_id !== userId && !msg.seen_by.includes(userId)
    );
    if (unseenMessages.length === 0) return;

    for (const msg of unseenMessages) {
      const updatedSeenBy = [...msg.seen_by, userId];
      await supabase.from("messages").update({ seen_by: updatedSeenBy }).eq("id", msg.id);
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
        async (payload) => {
          const newMessage: Message = payload.new as Message;
          set((state) => ({ messages: [...state.messages, newMessage] }));

          // Mark as read when a new message is received
          const userId = useUserStore.getState().user?.id;
          if (userId && newMessage.chat_id) {
            await get().markAsRead(newMessage.chat_id);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === (payload.new as Message).id ? (payload.new as Message) : msg
            ),
          }));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== payload.old.id),
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
