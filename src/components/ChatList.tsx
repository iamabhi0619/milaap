'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { usePathname } from 'next/navigation';
import {
  ChatItem,
  ChatListSkeleton,
  EmptyState,
  ChatListHeader,
} from '@/components/chat-list';
import { useUserStore } from '@/stores/userStore';
import { useMessageStore } from '@/stores/message';
import { ScrollArea } from '@/components/ui/scroll-area';

function ChatList() {
  const { chats, loading, fetchChats } = useChatStore();
  const { selectChat } = useMessageStore();
  const { user } = useUserStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChats();
  }, [fetchChats, user]);

  const handleChatClick = (chatId: string) => {
    selectChat(chatId);
    // router.push(`/chats/${chatId}`);
  };

  const isActiveChat = (chatId: string) => {
    return pathname?.includes(chatId);
  };

  const handleNewChat = () => {
    // TODO: Implement new chat logic
    console.log('New chat clicked');
  };

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!searchQuery.trim()) return chats;

    const query = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.display_name.toLowerCase().includes(query) ||
        chat.last_message?.toLowerCase().includes(query)
    );
  }, [chats, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <ChatListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewChat={handleNewChat}
        />
        <ChatListSkeleton count={6} />
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <ChatListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewChat={handleNewChat}
        />
        <EmptyState onNewChat={handleNewChat} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <ChatListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewChat={handleNewChat}
      />

      {filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <p className="text-muted-foreground">No chats found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className='space-y-1 px-2 pt-2 pb-4'>
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.chat_id}
                chatId={chat.chat_id}
                displayName={chat.display_name}
                avatar={chat.avatar}
                isGroup={chat.is_group}
                lastMessage={chat.last_message}
                lastMessageAt={chat.last_message_at}
                isActive={isActiveChat(chat.chat_id)}
                unreadCount={0} // TODO: Add unread count from store
                onClick={handleChatClick}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default ChatList;