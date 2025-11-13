import { Message } from "@/types/table";
import { supabase } from "../supabase";


interface SendMessageOptions {
    chat_id: string;
    sender_id: string;
    text?: string | null;
    image_url?: string | null;
    voice_url?: string | null;
    reply_to?: string | null;
    attachments?: Array<{ url: string; type: string; name?: string }>;
}

export async function sendMessage({
    chat_id,
    sender_id,
    text = null,
    image_url = null,
    voice_url = null,
    reply_to = null,
    attachments = [],
}: SendMessageOptions): Promise<Message | null> {
    try {
        // 🧱 Insert new message
        const { data: messageData, error: messageError } = await supabase
            .from("messages")
            .insert([
                {
                    chat_id,
                    sender_id,
                    text,
                    image_url,
                    voice_url,
                    reply_to,
                },
            ])
            .select(
                "id, chat_id, sender_id, text, image_url, voice_url, reply_to, created_at"
            )
            .single();

        if (messageError) throw messageError;

        // 📎 Insert attachments if any (audio, video, documents)
        if (attachments.length > 0 && messageData) {
            console.log(attachments)
            const attachmentRecords = attachments.map(att => ({
                message_id: messageData.id,
                file_url: att.url,
                file_type: att.type,
                file_name: att.name
            }));

            const { error: attachmentError } = await supabase
                .from("attachments")
                .insert(attachmentRecords);

            if (attachmentError) {
                console.error("⚠️ Error inserting attachments:", attachmentError.message);
            }
        }
        return messageData as Message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("❌ Error sending message:", err.message);
        return null;
    }
}
