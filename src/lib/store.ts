import { create } from "zustand";

interface Chat {
  id: string;
  createdAt: string;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  imageUrl?: string;
  voiceUrl?: string;
  createdAt: string;
}

interface ChatStore {
  chats: Chat[];
  messages: { [key: string]: Message[] }; // Messages per chat
  selectedChatId: string | null;
  addChat: (chat: Chat) => void;
  selectChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  messages: {},
  selectedChatId: null,
  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
      messages: { ...state.messages, [chat.id]: [] },
    })),
  selectChat: (chatId) => set({ selectedChatId: chatId }),
  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),
}));
