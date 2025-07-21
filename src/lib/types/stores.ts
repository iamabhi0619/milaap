import { Chat } from "./chat";
import { DBUser } from "./db";
import { Message } from "./message";

export interface UserStore {
  id: string | null;
  user: DBUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, isRemember: boolean) => Promise<boolean>;
  register: (email: string, password: string, name: string, gender: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgetPassword: (email: string) => Promise<boolean>;
  fetchUser: () => Promise<void>;
}

export interface ChatStore {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  unreadChatsIds: Set<string>;
  loading: boolean;
  error: string | null;

  createChat: (userId: string[], chatName?: string, isGroupChat?: boolean) => Promise<void>;
  fetchChats: (userId: string) => Promise<void>;
  // selectChat: (chatId: string) => void;
  // fetchMessages: (chatId: string) => Promise<void>;
  // addMessages: (messages: Message) => void;
  // markAsRead: (chatId: string) => Promise<void>;
  // selectChats: (chats: Chat[]) => void;
  // setSelectedChat: (chat: Chat | null) => void;
  // addChat: (chat: Chat) => void;
  // updateChat: (chat: Chat) => void;
}
