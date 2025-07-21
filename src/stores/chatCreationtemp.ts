import { supabase } from "@/lib/supabase";
import { create } from "zustand";

interface ChatStoreState {
  createOneToOneChat: (userId1: string, userId2: string) => Promise<string | null>;
  createGroupChat: (chatName: string, adminId: string, userIds: string[]) => Promise<string | null>;
}

export const useChatCreationStore = create<ChatStoreState>(() => ({
  createOneToOneChat: async (userId1, userId2) => {
    // Check if chat already exists between the users
    const { data: existingChat, error: findError } = await supabase
      .from("chat_users")
      .select("chat_id")
      .in("user_id", [userId1, userId2])
      .limit(2);

    if (findError) {
      console.error("Error checking existing chat:", findError);
      return null;
    }

    if (existingChat && existingChat.length === 2) {
      return existingChat[0].chat_id; // Return existing chat ID
    }

    // Create a new chat
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([{ is_group_chat: false }])
      .select()
      .single();

    if (chatError) {
      console.error("Error creating chat:", chatError);
      return null;
    }

    // Add users to chat_users table
    const { error: userError } = await supabase.from("chat_users").insert([
      { chat_id: chat.id, user_id: userId1 },
      { chat_id: chat.id, user_id: userId2 },
    ]);

    if (userError) {
      console.error("Error adding users to chat:", userError);
      return null;
    }

    return chat.id;
  },

  createGroupChat: async (chatName, adminId, userIds) => {
    // Create a new group chat
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([{ chat_name: chatName, is_group_chat: true, group_admin: adminId }])
      .select()
      .single();

    if (chatError) {
      console.error("Error creating group chat:", chatError);
      return null;
    }

    // Add users to chat_users table
    const chatUsers = userIds.map((userId) => ({ chat_id: chat.id, user_id: userId }));
    const { error: userError } = await supabase.from("chat_users").insert(chatUsers);

    if (userError) {
      console.error("Error adding users to group chat:", userError);
      return null;
    }

    return chat.id;
  },
}));
