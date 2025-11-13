/**
 * Message Canvas Utility Functions
 * Helper functions for message manipulation and formatting
 */

import { Message } from "@/types/table";
import moment from "moment";

/**
 * Group messages by date
 */
export const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);
};

/**
 * Format date for display
 */
export const formatMessageDate = (dateString: string): string => {
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");
  const messageDate = moment(dateString).startOf("day");

  if (messageDate.isSame(today, "day")) {
    return "Today";
  } else if (messageDate.isSame(yesterday, "day")) {
    return "Yesterday";
  } else if (messageDate.isAfter(moment().subtract(7, "days"))) {
    return messageDate.format("dddd"); // Monday, Tuesday, etc.
  } else {
    return messageDate.format("MMM D, YYYY");
  }
};

/**
 * Format time for display
 */
export const formatMessageTime = (dateString: string, use24Hour = false): string => {
  return moment(dateString).format(use24Hour ? "HH:mm" : "h:mm A");
};

/**
 * Check if message is from same sender as previous
 */
export const isSameSender = (current: Message, previous?: Message): boolean => {
  if (!previous) return false;
  return current.sender_id === previous.sender_id;
};

/**
 * Check if messages are within grouping time threshold (5 minutes)
 */
export const shouldGroupMessages = (current: Message, previous?: Message): boolean => {
  if (!previous || !isSameSender(current, previous)) return false;
  
  const currentTime = moment(current.created_at);
  const previousTime = moment(previous.created_at);
  
  return currentTime.diff(previousTime, "minutes") < 5;
};

/**
 * Extract mentions from message text
 */
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

/**
 * Extract URLs from message text
 */
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

/**
 * Check if message contains media
 */
export const hasMedia = (message: Message): boolean => {
  return !!(
    message.image_url ||
    message.voice_url ||
    (message.attachments && message.attachments.length > 0)
  );
};

/**
 * Get message preview text (for replies)
 */
export const getMessagePreview = (message: Message, maxLength = 50): string => {
  if (message.deleted) return "This message was deleted";
  
  if (message.image_url) return "📷 Photo";
  if (message.voice_url) return "🎤 Voice message";
  if (message.attachments && message.attachments.length > 0) {
    return `📎 ${message.attachments.length} attachment(s)`;
  }
  
  if (message.text) {
    return message.text.length > maxLength
      ? `${message.text.substring(0, maxLength)}...`
      : message.text;
  }
  
  return "Message";
};

/**
 * Search messages by query
 */
export const searchMessages = (messages: Message[], query: string): Message[] => {
  if (!query.trim()) return messages;
  
  const lowerQuery = query.toLowerCase();
  
  return messages.filter((message) => {
    if (message.deleted) return false;
    
    // Search in text
    if (message.text?.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in sender name
    if (message.sender?.name?.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  });
};

/**
 * Get reaction summary
 */
export const getReactionSummary = (message: Message): Record<string, number> => {
  if (!message.reactions) return {};
  
  return message.reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Check if user has reacted with specific emoji
 */
export const hasUserReacted = (
  message: Message,
  userId: string,
  emoji?: string
): boolean => {
  if (!message.reactions) return false;
  
  return message.reactions.some(
    (r) => r.user_id === userId && (emoji ? r.emoji === emoji : true)
  );
};

/**
 * Calculate unread count from a specific message
 */
export const getUnreadCount = (
  messages: Message[],
  lastSeenMessageId: string | null
): number => {
  if (!lastSeenMessageId) return messages.length;
  
  const lastSeenIndex = messages.findIndex((m) => m.id === lastSeenMessageId);
  if (lastSeenIndex === -1) return messages.length;
  
  return messages.length - lastSeenIndex - 1;
};

/**
 * Scroll to specific message
 */
export const scrollToMessage = (messageId: string, behavior: ScrollBehavior = "smooth") => {
  const element = document.getElementById(`message-${messageId}`);
  if (element) {
    element.scrollIntoView({ behavior, block: "center" });
    // Highlight message briefly
    element.classList.add("highlight-message");
    setTimeout(() => element.classList.remove("highlight-message"), 2000);
  }
};
