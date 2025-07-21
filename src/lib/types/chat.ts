export interface Chat {
  id: string;
  chat_name: string;
  is_group_chat: boolean;
  latest_message: string;
  group_admin: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}
