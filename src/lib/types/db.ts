/* ───────── lib/types/db.ts ───────── */
export type UUID = string;

/* users */
export interface DBUser {
  id: UUID;
  name: string;
  email: string;
  avatar: string | null;
  status: "online" | "offline" | "away";
  blocked: string[]; // array<UUID>
  gender: string;

  userId: string; // external auth id (you mentioned this earlier)
  created_at: string;
  updated_at: string;
}

/* chats */
export interface DBChat {
  id: UUID;
  chat_name: string | null;
  is_group_chat: boolean;
  group_admin: UUID | null;
  avatar: string | null;

  latest_message: DBMessage | null; // FK to messages.id
  created_at: string;
  updated_at: string;
}

/* chat_users */
export interface DBChatUser {
  chat_id: UUID;
  user_id: UUID;
}

/* messages */
export interface DBMessage {
  id: UUID;
  chat_id: UUID;
  sender_id: UUID;
  text: string | null;
  image_url: string | null;
  voice_url: string | null;
  edited: boolean;
  deleted: boolean;
  seen_by: UUID[];

  created_at: string;
}

export interface ChatWithUsers extends DBChat {
  users: Pick<DBUser, "id" | "name" | "avatar" | "status">[]; // via chat_users
}
