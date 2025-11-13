import { supabase } from "../supabase";
import { ChatsType } from "@/types/chats";


export async function fetchUserChats(currentUserId: string): Promise<ChatsType[]> {
    try {
        // 1️⃣ Get all chat_ids where current user is a participant
        const { data: myChats, error: chatError } = await supabase
            .from("chat_participants")
            .select("chat_id")
            .eq("user_id", currentUserId);

        if (chatError) throw chatError;
        if (!myChats || myChats.length === 0) return [];

        const chatIds = myChats.map((c) => c.chat_id);

        // 2️⃣ Fetch full chat info for those chat_ids
        const { data: chats, error: chatsError } = await supabase
            .from("chats")
            .select(`
        id,
        is_group,
        chat_name,
        chat_icon,
        created_at,
        updated_at,
        chat_participants (
          user_id,
          users (
            id,
            name,
            avatar
          )
        ),
        messages (
          text,
          created_at
        )
      `)
            .in("id", chatIds)
            .order("updated_at", { ascending: false });

        if (chatsError) throw chatsError;

        // 3️⃣ Transform data into UI-friendly structure
        const formatted = chats.map((chat) => {
            const lastMessage = chat.messages?.[chat.messages.length - 1];
            let displayName = chat.chat_name;
            let avatar = chat.chat_icon;

            // For DM (is_group = false)
            if (!chat.is_group) {
                const otherParticipant = chat.chat_participants.find(
                    (p) => p.user_id !== currentUserId
                );
                const other = otherParticipant?.users;
                // Handle both array and object cases from Supabase
                if (other) {
                    if (Array.isArray(other) && other.length > 0) {
                        displayName = other[0].name;
                        avatar = other[0].avatar;
                    } else if (!Array.isArray(other)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        displayName = (other as any).name;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        avatar = (other as any).avatar;
                    }
                }
            }

            return {
                chat_id: chat.id,
                is_group: chat.is_group,
                display_name: displayName,
                avatar,
                last_message: lastMessage?.text ?? null,
                last_message_at: lastMessage?.created_at ?? chat.updated_at,
                created_at: chat.created_at,
                updated_at: chat.updated_at,
            };
        });

        // Sort chats by last message time (latest first)
        formatted.sort(
            (a, b) =>
                new Date(b.last_message_at).getTime() -
                new Date(a.last_message_at).getTime()
        );

        return formatted;
    } catch (error) {
        console.error("Error fetching chats:", error);
        return [];
    }
}
