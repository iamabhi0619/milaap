export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  image_url: string | null;
  voice_url: string | null;
  text: string | null;
  edited: boolean;
  deleted: boolean;
  seen_by: string[];
  created_at: string;
}
