import { ChatStore } from "@/types/store/chat";
import { create } from "zustand";
import { useUserStore } from "./userStore";
import { createOrGetDM } from "@/lib/utils/create-add-chats";
import { fetchUserChats } from "@/lib/utils/fetch-chats";



export const useChatStore = create<ChatStore>((set) => ({
    loading: false,
    error: null,
    chats: null,
    fetchChats: async () => {
        try {
            set({ loading: true, error: null });
            const { user, isAuthenticated } = useUserStore.getState();

            if (!isAuthenticated || !user) {
                // console.error("User not authenticated");
                return;
            }
            const data = await fetchUserChats(user.id);
            set({ chats: data });
        } catch {
            // Handle error silently
        } finally {
            set({ loading: false })
        }
    },
    addDM: async (userId: string) => {
        const { user, isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated || !user) {
            // console.error("User not authenticated");
            return;
        }
        await createOrGetDM(user.id, userId);
        useChatStore.getState().fetchChats();
    }
}));
