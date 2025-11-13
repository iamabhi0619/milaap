/**
 * Type definitions for Message Canvas components
 * Extends base types from @/types/table
 */

import { Message, User, Reaction } from "@/types/table";

// ============================================
// Component Props Types
// ============================================

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isGroupChat: boolean;
  showAvatar?: boolean;
  currentUserId: string;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export interface MessageContentProps {
  message: Message;
  isOwn: boolean;
  className?: string;
}

export interface MessageActionsProps {
  message: Message;
  isOwn: boolean;
  onReply: () => void;
  onReact: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onCopy?: () => void;
  onPin?: () => void;
  onReport?: () => void;
}

export interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  currentUserId: string;
  isOwn: boolean;
  onReactionClick?: (emoji: string) => void;
}

export interface MessageAttachmentsProps {
  message: Message;
  onImageClick?: (url: string) => void;
  onFileDownload?: (url: string, filename: string) => void;
}

export interface MessageReplyProps {
  replyMessage?: Message;
  isOwn: boolean;
  onReplyClick?: (messageId: string) => void;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isGroupChat: boolean;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export interface DateDividerProps {
  date: string;
  className?: string;
}

export interface LoadMoreTriggerProps {
  onLoadMore?: () => void;
  loading?: boolean;
  className?: string;
}

export interface EmptyMessagesProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface TypingIndicatorProps {
  users: Array<{
    id?: string;
    name: string;
    avatar?: string;
  }>;
  className?: string;
}

export interface MessageSearchProps {
  onSearch: (query: string) => void;
  resultsCount?: number;
  className?: string;
}

export interface EmojiReactionPickerProps {
  onReact: (emoji: string) => void;
  messageId: string;
  className?: string;
}

export interface MessageStatusProps {
  status: "sent" | "delivered" | "seen";
  timestamp: string;
  className?: string;
}

export interface MessageSeenByProps {
  seenBy: Array<{
    id: string;
    name: string;
    avatar?: string;
    seenAt: string;
  }>;
}

export interface ScrollToBottomProps {
  onClick: () => void;
  unreadCount?: number;
  show: boolean;
  className?: string;
}

export interface ReplyPreviewProps {
  message: Message | null;
  onCancel: () => void;
  className?: string;
}

export interface MessageEditProps {
  initialText: string;
  onSave: (newText: string) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

// ============================================
// Configuration Types
// ============================================

export interface MessageCanvasConfig {
  messageStyles: {
    bubbleRadius: BubbleRadius;
    messagePadding: MessagePadding;
    avatarSize: AvatarSize;
  };
  colorSchemes: {
    [key: string]: ColorScheme;
  };
  features: FeatureFlags;
  animations: AnimationConfig;
  messages: MessageConfig;
}

export type BubbleRadius = "default" | "square" | "round" | "minimal";
export type MessagePadding = "compact" | "default" | "comfortable";
export type AvatarSize = "small" | "default" | "large";

export interface ColorScheme {
  ownMessageBg: string;
  ownMessageText: string;
  otherMessageBg: string;
  otherMessageText: string;
}

export interface FeatureFlags {
  enableReactions: boolean;
  enableReply: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  enableFormatting: boolean;
  enableVoiceNotes: boolean;
  enableFileAttachments: boolean;
  showSeenStatus: boolean;
  showTypingIndicator: boolean;
  showOnlineStatus: boolean;
  enableMessageSearch: boolean;
  enablePinMessages: boolean;
}

export interface AnimationConfig {
  messageEntry: {
    enabled: boolean;
    type: "slide-up" | "fade" | "scale" | "none";
    duration: number;
  };
  reactionPop: {
    enabled: boolean;
    scale: number;
  };
  typingDots: {
    enabled: boolean;
    speed: number;
  };
}

export interface MessageConfig {
  maxLength: number;
  loadMoreCount: number;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

// ============================================
// Hook Return Types
// ============================================

export interface UseMessageScrollReturn {
  scrollRef: React.RefObject<HTMLDivElement>;
  showScrollButton: boolean;
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export interface UseMessageSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Message[];
  currentResultIndex: number;
  nextResult: () => void;
  previousResult: () => void;
}

export interface UseMessageReplyReturn {
  replyingTo: Message | null;
  startReply: (message: Message) => void;
  cancelReply: () => void;
}

export interface UseMessageEditReturn {
  editingMessage: Message | null;
  startEdit: (message: Message) => void;
  cancelEdit: () => void;
  saveEdit: (newText: string) => Promise<void>;
}

export interface UseTypingIndicatorReturn {
  typingUsers: Array<{ id: string; name: string; avatar?: string }>;
  isTyping: boolean;
  startTyping: () => void;
  stopTyping: () => void;
}

export interface UseInfiniteMessagesReturn {
  triggerRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
}

export interface UseMessageReactionsReturn {
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  toggleReaction: (messageId: string, emoji: string, hasReacted: boolean) => Promise<void>;
}

// ============================================
// Utility Types
// ============================================

export interface GroupedMessages {
  [date: string]: Message[];
}

export interface SearchResult {
  message: Message;
  matchIndex: number;
  matchLength: number;
}

export interface ReactionSummary {
  [emoji: string]: {
    count: number;
    users: User[];
    hasCurrentUser: boolean;
  };
}

export type MessageAlignment = "left" | "right" | "center";
export type MessageStatus = "sending" | "sent" | "delivered" | "seen" | "failed";
export type AttachmentType = "image" | "video" | "audio" | "document" | "voice";

// ============================================
// Event Handler Types
// ============================================

export type OnMessageClick = (message: Message) => void;
export type OnMessageLongPress = (message: Message) => void;
export type OnReactionClick = (messageId: string, emoji: string) => void;
export type OnReplyClick = (message: Message) => void;
export type OnEditClick = (message: Message) => void;
export type OnDeleteClick = (messageId: string) => void;
export type OnLoadMore = () => void;
export type OnSearch = (query: string) => void;
export type OnScrollToBottom = () => void;

// ============================================
// Context Types
// ============================================

export interface MessageCanvasContextValue {
  config: MessageCanvasConfig;
  currentUserId: string;
  isGroupChat: boolean;
  features: FeatureFlags;
  handlers: {
    onReply?: OnReplyClick;
    onEdit?: OnEditClick;
    onDelete?: OnDeleteClick;
    onReact?: OnReactionClick;
  };
}
