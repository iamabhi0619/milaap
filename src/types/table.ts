export interface User {
    id: string;
    username: string;
    name?: string | null;
    avatar?: string | null;
    status: 'online' | 'offline' | 'typing' | null;
    last_seen?: string | null; // ISO string timestamp
    updated_at?: string | null;
}

export interface Chat {
    id: string;
    is_group: boolean;
    chat_name?: string | null;
    chat_icon?: string | null;
    created_by: string; // user_id
    pinned: boolean;
    created_at: string;
    updated_at: string;
}

export interface ChatParticipant {
    id: string;
    chat_id: string;
    user_id: string;
    role: 'admin' | 'member';
    joined_at: string;
    muted: boolean;
    typing: boolean;
    unread_count: number;
    // optional embedded user info if fetched via join
    user?: User;
}

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    text?: string | null;
    image_url?: string | null;
    voice_url?: string | null;
    reply_to?: string | null;
    seen_by: string[];
    edited: boolean;
    deleted: boolean;
    created_at: string;
    sender?: User;
    reply_message?: Message;
    attachments?: Attachment[];
    reactions?: Reaction[];
}

export interface Reaction {
    id: string;
    message_id: string;
    user_id: string;
    emoji: string;
    created_at: string;
    user?: User;
}

export interface Attachment {
    id: string;
    message_id: string;
    file_url: string;
    file_type?: string | null;
    file_name?: string | null;
    created_at: string;
}

export interface MessageStatus {
    message_id: string;
    user_id: string;
    status: 'sent' | 'delivered' | 'seen';
    updated_at: string;
}

export interface UserBlock {
    id: string;
    blocker_id: string;
    blocked_id: string;
    created_at: string;
}
