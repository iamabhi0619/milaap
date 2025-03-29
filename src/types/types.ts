// User Type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar: string;
  token: string;
  blocked: string[];
}

// Message Type
export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text?: string; // Made optional to handle cases where only media is sent
  encrypted_text?: string;
  image_url?: string;
  voice_url?: string;
  edited: boolean;
  deleted: boolean;
  seen_by: string[];
  created_at: string;
}

// Chat Type
export interface Chat {
  id: string;
  chat_name?: string;
  is_group_chat: boolean;
  avatar?: string; // Made optional for better flexibility
  created_at?: string;
  updated_at?: string;
  latest_message?: Message;
  group_admin?: string;
}

// Chat Users Table Type
export interface ChatUser {
  chat_id: string;
  user_id: string;
}

// User Store State
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  convertMongoIdToUUID: (uuid: string) => string;
}

// Zustand Store Types
export interface MessageStoreState {
  messages: Message[];
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (text: string, image_url?: string, voice_url?: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  handleMessageUpdates: () => () => void;
  resetMessages: () => void;
}

export interface ChatStoreState {
  chatId: string | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  chats: Chat[];
  fetchChats: (userId: string) => Promise<void>;
  changeChat: (chatId: string) => void;
  resetChat: () => void;
}
