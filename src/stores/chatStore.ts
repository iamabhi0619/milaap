import { supabase } from "@/lib/supabase";
import { ChatWithUsers, DBMessage } from "@/lib/types/db";
import { toast } from "sonner";
import { create } from "zustand";

interface ChatStore {
  chats: ChatWithUsers[];
  selectedChat: ChatWithUsers | null;
  messages: DBMessage[];
  unreadChatIds: Set<string>;
  loading: boolean;
  error: string | null;

  createChat: (userIds: string[], chatName?: string, isGroupChat?: boolean) => Promise<void>;
  fetchChats: (userId: string) => Promise<void>;
  selectChat: (chat: ChatWithUsers) => void;
  clearSelectedChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  unreadChatIds: new Set(),
  loading: false,
  error: null,

  selectChat: (chat) => set({ selectedChat: chat }),
  clearSelectedChat: () => set({ selectedChat: null }),

  createChat: async (userIds, chatName, isGroupChat = false) => {
    try {
      const creatorId = userIds[0];

      // Check for existing 1-to-1 chat
      if (!isGroupChat && userIds.length === 2) {
        const { data: cuRows, error: cuErr } = await supabase
          .from("chat_users")
          .select("chat_id, user_id")
          .in("user_id", userIds);

        if (cuErr) throw cuErr;

        const counts: Record<string, number> = {};
        cuRows.forEach((r) => (counts[r.chat_id] = (counts[r.chat_id] ?? 0) + 1));
        const existingChatId = Object.entries(counts).find(([, n]) => n === 2)?.[0];

        if (existingChatId) {
          const { data: existingChat } = await supabase
            .from("chats")
            .select("*, users!chat_users_user_id_fkey(id,name,avatar,status), latest_message(*)")
            .eq("id", existingChatId)
            .single();

          if (existingChat) {
            toast.info("Chat already exists");
            set({ selectedChat: existingChat });
            return;
          }
        }
      }

      const { data: chatRow, error: chatInsertError } = await supabase
        .from("chats")
        .insert({
          chat_name: isGroupChat ? chatName ?? "New Group" : null,
          is_group_chat: isGroupChat,
          group_admin: isGroupChat ? creatorId : null,
          avatar: null,
        })
        .select("*")
        .single();

      if (chatInsertError) throw chatInsertError;

      const members = userIds.map((user_id) => ({
        chat_id: chatRow.id,
        user_id,
      }));

      const { error: usersInsertError } = await supabase.from("chat_users").insert(members);

      if (usersInsertError) throw usersInsertError;

      const { data: fullChat, error: fullChatError } = await supabase
        .from("chats")
        .select("*, users!chat_users_user_id_fkey(id,name,avatar,status), latest_message(*)")
        .eq("id", chatRow.id)
        .single();

      if (fullChatError) throw fullChatError;

      set((state) => ({
        chats: [fullChat, ...state.chats],
        selectedChat: fullChat,
      }));
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") console.error(error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create chat");
      } else {
        toast.error("Failed to create chat");
      }
    }
  },

  fetchChats: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      if (!userId) throw new Error("User ID is required to fetch chats");

      const { data: chatUserData, error: chatUserError } = await supabase
        .from("chat_users")
        .select("chat_id")
        .eq("user_id", userId);

      if (chatUserError) throw chatUserError;
      if (!chatUserData || chatUserData.length === 0) {
        set({ chats: [], loading: false });
        toast.info("No chats found. Please start a new conversation.");
        return;
      }

      const chatIds = chatUserData.map((c) => c.chat_id);

      const { data, error } = await supabase
        .from("chats")
        .select("*, users!chat_users_user_id_fkey(id,name,avatar,status), latest_message(*)")
        .in("id", chatIds)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      set({ chats: data || [], loading: false });
    } catch (error: unknown) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch chats",
      });
      if (process.env.NODE_ENV === "development") console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch chats");
    }
  },
}));
