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
  seen_by: string[]; // Removed status field
  created_at: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  blocked: string[];
}

interface Chat {
  id: string;
  chat_name?: string;
  is_group_chat: boolean;
  members: string[];
  avatar: string;
  created_at?: string;
  updated_at?: string;
  latest_message?: Message;
  group_admin?: string;
}

interface ChatStoreState {
  chatId: string | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  messages: Message[];
  chats: Chat[];

  fetchChats: (user: ChatUser) => Promise<void>;
  changeChat: (chatId: string) => Promise<void>;
  sendMessage: (text: string, image_url?: string, voice_url?: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  handleMessageUpdates: () => () => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  chatId: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  messages: [],
  chats: [],

  fetchChats: async (user) => {
    const { data: chatUserData, error: chatUserError } = await supabase
      .from("chat_users")
      .select("chat_id")
      .eq("user_id", user.id);

    if (chatUserError || !chatUserData) {
      console.error("Error fetching user chats:", chatUserError);
      return;
    }

    const chatIds = chatUserData.map((c) => c.chat_id);

    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .select("*, latest_message:messages!chats_latest_message_fkey(*)")
      .in("id", chatIds);

    if (chatError || !chatData) {
      console.error("Error fetching chats:", chatError);
      return;
    }

    const processedChats = await Promise.all(
      chatData.map(async (chat) => {
        if (!chat.is_group_chat) {
          const { data: chatUsers, error: chatUsersError } = await supabase
            .from("chat_users")
            .select("user_id")
            .eq("chat_id", chat.id);

          if (chatUsersError || !chatUsers) return chat;

          const otherUserId = chatUsers.find((cu) => cu.user_id !== user.id)?.user_id;
          if (!otherUserId) return chat;

          const { data: otherUser, error: userError } = await supabase
            .from("users")
            .select("name, avatar")
            .eq("id", otherUserId)
            .single();

          if (userError || !otherUser) return chat;

          return { ...chat, chat_name: otherUser.name, avatar: otherUser.avatar };
        }
        return chat;
      })
    );

    set({ chats: processedChats });
  },

  changeChat: async (chatId) => {
    set({ chatId, messages: [] });

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

    await get().markAsRead();
  },

  sendMessage: async (text, image_url, voice_url) => {
    const user = useUserStore.getState().user;
    const { chatId, isReceiverBlocked } = get();
    if (!chatId || !user || isReceiverBlocked) return;

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

  markAsRead: async () => {
    const user = useUserStore.getState().user;
    const { chatId, messages } = get();
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
          const { chatId } = get();
          if (payload.new.chat_id === chatId) {
            const newMessage: Message = {
              id: payload.new.id,
              chat_id: payload.new.chat_id,
              sender_id: payload.new.sender_id,
              text: payload.new.text,
              encrypted_text: payload.new.encrypted_text,
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

  resetChat: () => {
    set({ chatId: null, isCurrentUserBlocked: false, isReceiverBlocked: false, messages: [] });
  },
}));
