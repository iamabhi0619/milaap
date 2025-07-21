import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { ChatStoreState } from "@/types/types";

export const useChatStore = create<ChatStoreState>((set) => ({
  chatId: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  chats: [],

  fetchChats: async (userId: string) => {
    try {
      const { data: chatUserData, error: chatUserError } = await supabase
        .from("chat_users")
        .select("chat_id")
        .eq("user_id", userId);

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
            if (chatUsersError || !chatUsers) {
              console.error("Error fetching chat users:", chatUsersError);
              return chat;
            }
            const otherUserId = chatUsers.find((cu) => cu.user_id !== userId)?.user_id;
            if (!otherUserId) {
              console.warn("No other user found for chat:", chat.id);
              return chat;
            }
            const { data: otherUser, error: userError } = await supabase
              .from("users")
              .select("name, avatar")
              .eq("id", otherUserId)
              .single();

            if (userError || !otherUser) {
              console.error("Error fetching other user details:", userError);
              return chat;
            }

            return {
              ...chat,
              chat_name: otherUser.name,
              avatar: otherUser.avatar,
              name: otherUser.name, // Add name property
            };
          }
          return chat;
        })
      );

      set({ chats: processedChats });
    } catch (error) {
      console.error("Unexpected error in fetchChats:", error);
    }
  },

  changeChat: (chatId: string) => {
    set({ chatId });
  },

  resetChat: () => {
    set({ chatId: null, isCurrentUserBlocked: false, isReceiverBlocked: false });
  },
}));
