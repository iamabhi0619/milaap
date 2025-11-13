import { supabase } from "../supabase";


export async function createOrGetDM(userA_id: string, userB_id: string) {
    try {
        // 🧠 1️⃣ Check if chat already exists
        const { data: existingChat, error: existingError } = await supabase
            .from("chats")
            .select("id")
            .eq("is_group", false)
            .in(
                "id",
                (
                    await supabase
                        .from("chat_participants")
                        .select("chat_id")
                        .eq("user_id", userA_id)
                ).data?.map((p) => p.chat_id) || []
            )
            .in(
                "id",
                (
                    await supabase
                        .from("chat_participants")
                        .select("chat_id")
                        .eq("user_id", userB_id)
                ).data?.map((p) => p.chat_id) || []
            )
            .limit(1)
            .maybeSingle();

        if (existingError) throw existingError;

        // ✅ If found, return that chat_id
        if (existingChat) {
            console.log("Existing DM found:", existingChat.id);
            return existingChat.id;
        }

        // 🧱 2️⃣ Otherwise, create new chat
        const { data: newChat, error: chatError } = await supabase
            .from("chats")
            .insert({
                is_group: false,
                created_by: userA_id,
            })
            .select("id")
            .single();

        if (chatError) throw chatError;

        const chatId = newChat.id;

        // 👥 3️⃣ Add both participants
        const { error: participantsError } = await supabase
            .from("chat_participants")
            .insert([
                { chat_id: chatId, user_id: userA_id, role: "member" },
                { chat_id: chatId, user_id: userB_id, role: "member" },
            ]);

        if (participantsError) throw participantsError;

        console.log("New DM created:", chatId);
        return chatId;
    } catch (error) {
        console.error("Error in createOrGetDM:", error);
        return null;
    }
}
