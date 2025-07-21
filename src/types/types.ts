export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  blocked: string[]; // List of user IDs that this user has blocked
  token: string;
}

export interface Message {
  id: string;
  created_at: string;
  chat_id: string;
  sender_id: string;
  image_url?: string;
  voice_url?: string;
  edited: boolean;
  deleted: boolean;
  text?: string;
  seen_by: string[]; // List of user IDs who have seen the message
}

export interface Chat {
  id: string;
  chat_name: string;
  is_group_chat: boolean;
  latest_message?: Message;
  group_admin?: string; // user_id of admin (only for group chats)
  updated_at: string;
  avatar?: string;
}

export interface ChatUser {
  chat_id: string;
  user_id: string;
}

// --- Additional Types ---

// Enums for message types
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VOICE = "voice",
}

// Enums for chat actions
export enum ChatAction {
  CREATE = "create",
  DELETE = "delete",
  ADD_USER = "add_user",
  REMOVE_USER = "remove_user",
  UPDATE_NAME = "update_name",
}

// Enums for message status
export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

// --- Payloads for API requests ---

// Create Chat Payload
export interface CreateChatPayload {
  user_ids: string[]; // List of user IDs to add
  chat_name?: string;
  is_group_chat: boolean;
}

// Send Message Payload
export interface SendMessagePayload {
  chat_id: string;
  sender_id: string;
  text?: string;
  image_url?: string;
  voice_url?: string;
}

// Update Message Status Payload
export interface UpdateMessageStatusPayload {
  message_id: string;
  seen_by: string[]; // List of users who have seen the message
}

// Group Admin Actions
export interface GroupAdminAction {
  chat_id: string;
  user_id: string;
  action: ChatAction;
}

// Notification Schema
export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string;
  chat_id?: string;
  message?: string;
  type: "message" | "group_invite" | "mention";
  is_read: boolean;
  created_at: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  convertMongoIdToUUID: (mongoId: string) => string;
}

// Zustand Store Types
// ** Zustand Store for User State **
export interface MessageStoreState {
  messages: Message[];
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (text: string, image_url?: string, voice_url?: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
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
