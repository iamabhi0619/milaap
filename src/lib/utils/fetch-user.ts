import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/userStore";
import { create } from "zustand";

interface User {
    id: string;
    name: string;
    username: string;
    avatar?: string;
}

interface UserChats {
    loading: boolean;
    error: string | null;
    users: User[] | null;
    fetchUsers: (params: { q: string }) => Promise<void>;
}

export const useChatStore = create<UserChats>((set) => ({
    loading: false,
    error: null,
    users: null,
    fetchUsers: async ({ q }) => {
        try {
            set({ loading: true, error: null });
            const { user, isAuthenticated } = useUserStore.getState();

            if (!isAuthenticated || !user) {
                console.error("User not authenticated");
                return;
            }

            const { data, error } = await supabase.from('users').select('id, avatar, name, username').ilikeAnyOf('name, username, id', [`%${q}%`]).neq('id', user.id);
            if (error) throw error;
            set({ users: data });
        } catch {
            // Handle error silently
        } finally {
            set({ loading: false })
        }
    },
}));
