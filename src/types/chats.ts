export interface ChatsType {
    chat_id: string;
    is_group: boolean;
    display_name: string;
    avatar?: string | null;
    created_at: string;
    updated_at: string;
    last_message?: string | null;
    last_message_at?: string | null;
}
