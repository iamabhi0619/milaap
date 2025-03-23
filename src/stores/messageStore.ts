import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "./userStore";

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  encrypted_text?: string;
  image_url?: string;
  voice_url?: string;
  edited: boolean;
  deleted: boolean;
  seen_by: string[];
  created_at: string;
}

interface MessageStoreState {
  messages: Message[];
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (
    chatId: string,
    text: string,
    image_url?: string,
    voice_url?: string
  ) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  handleMessageUpdates: () => () => void;
  resetMessages: () => void;
}

export const useMessageStore = create<MessageStoreState>((set, get) => ({
  messages: [],

  fetchMessages: async (chatId) => {
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

  sendMessage: async (chatId, text, image_url, voice_url) => {
    const user = useUserStore.getState().user;
    if (!chatId || !user) return;

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          sender_id: user.id,
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

    await supabase.from("chats").update({ latest_message: data.id }).eq("id", chatId);
  },

  markAsRead: async (chatId) => {
    const user = useUserStore.getState().user;
    const { messages } = get();
    if (!chatId || !user) return;

    const unseenMessages = messages.filter(
      (msg) => msg.sender_id !== user.id && !msg.seen_by.includes(user.id)
    );

    if (unseenMessages.length === 0) return;

    for (const msg of unseenMessages) {
      await supabase
        .from("messages")
        .update({
          seen_by: [...msg.seen_by, user.id],
        })
        .eq("id", msg.id);
    }

    set({
      messages: messages.map((msg) =>
        msg.sender_id !== user.id && !msg.seen_by.includes(user.id)
          ? { ...msg, seen_by: [...msg.seen_by, user.id] }
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
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === payload.new.id ? { ...msg, seen_by: payload.new.seen_by } : msg
            ),
          }));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === payload.new.id ? { ...msg, seen_by: payload.new.seen_by } : msg
            ),
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
