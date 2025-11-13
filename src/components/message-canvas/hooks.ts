/**
 * Custom hooks for Message Canvas
 * Reusable logic for message-related functionality
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "@/types/table";
import { useMessageStore } from "@/stores/message";

/**
 * Hook for managing scroll behavior
 */
export const useMessageScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    setIsAtBottom(distanceFromBottom < 100);
    setShowScrollButton(distanceFromBottom > 300);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return {
    scrollRef,
    showScrollButton,
    isAtBottom,
    scrollToBottom,
  };
};

/**
 * Hook for managing message search
 */
export const useMessageSearch = (messages: Message[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const results = messages.filter((msg) =>
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setCurrentResultIndex(0);
  }, [searchQuery, messages]);

  const nextResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prev) =>
      prev < searchResults.length - 1 ? prev + 1 : 0
    );
  }, [searchResults.length]);

  const previousResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prev) =>
      prev > 0 ? prev - 1 : searchResults.length - 1
    );
  }, [searchResults.length]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentResultIndex,
    nextResult,
    previousResult,
  };
};

/**
 * Hook for managing reply state
 */
export const useMessageReply = () => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const startReply = useCallback((message: Message) => {
    setReplyingTo(message);
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  return {
    replyingTo,
    startReply,
    cancelReply,
  };
};

/**
 * Hook for managing message edit state
 */
export const useMessageEdit = () => {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const startEdit = useCallback((message: Message) => {
    setEditingMessage(message);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  const saveEdit = useCallback(
    async (newText: string) => {
      if (!editingMessage) return;

      try {
        // TODO: Implement edit message API call
        console.log("Saving edit:", editingMessage.id, newText);
        setEditingMessage(null);
      } catch (error) {
        console.error("Failed to save edit:", error);
        throw error;
      }
    },
    [editingMessage]
  );

  return {
    editingMessage,
    startEdit,
    cancelEdit,
    saveEdit,
  };
};

/**
 * Hook for managing typing indicator
 */
export const useTypingIndicator = (chatId: string) => {
  const [typingUsers] = useState<
    Array<{ id: string; name: string; avatar?: string }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    // TODO: Send typing status to server
    console.log("User started typing in chat:", chatId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log("User stopped typing in chat:", chatId);
    }, 3000);
  }, [chatId]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // TODO: Send stop typing status to server
    console.log("User stopped typing in chat:", chatId);
  }, [chatId]);

  useEffect(() => {
    // TODO: Listen for typing status from other users
    // This would typically use Supabase realtime or websockets

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  return {
    typingUsers,
    isTyping,
    startTyping,
    stopTyping,
  };
};

/**
 * Hook for infinite scroll / load more messages
 */
export const useInfiniteMessages = (chatId: string) => {
  const { messages, loading, hasMore, loadMessages } = useMessageStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || messages.length === 0) return;

    const oldestMessage = messages[0];
    if (oldestMessage) {
      loadMessages(chatId, oldestMessage.created_at);
    }
  }, [chatId, loading, hasMore, messages, loadMessages]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observerRef.current.observe(currentTrigger);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  return {
    triggerRef,
    loadMore,
  };
};

/**
 * Hook for message reactions
 */
export const useMessageReactions = () => {
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      // TODO: Implement add reaction API call
      console.log("Adding reaction:", messageId, emoji);
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  }, []);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      // TODO: Implement remove reaction API call
      console.log("Removing reaction:", messageId, emoji);
    } catch (error) {
      console.error("Failed to remove reaction:", error);
    }
  }, []);

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string, hasReacted: boolean) => {
      if (hasReacted) {
        await removeReaction(messageId, emoji);
      } else {
        await addReaction(messageId, emoji);
      }
    },
    [addReaction, removeReaction]
  );

  return {
    addReaction,
    removeReaction,
    toggleReaction,
  };
};
