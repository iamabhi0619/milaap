import { create } from "zustand";

interface Notification {
  chatId: string;
  count: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (chatId: string) => void;
  clearNotifications: (chatId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (chatId) =>
    set((state) => {
      const existingNotification = state.notifications.find((n) => n.chatId === chatId);
      return {
        notifications: existingNotification
          ? state.notifications.map((n) => (n.chatId === chatId ? { ...n, count: n.count + 1 } : n))
          : [...state.notifications, { chatId, count: 1 }],
      };
    }),
  clearNotifications: (chatId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.chatId !== chatId),
    })),
}));
