"use client";

import React, { useEffect, useRef } from "react";
import moment from "moment";
import { Message } from "@/types/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyMessages from "./EmptyMessages";
import LoadMoreTrigger from "./LoadMoreTrigger";
import DateDivider from "./DateDivider";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isGroupChat: boolean;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isGroupChat,
  loading = false,
  hasMore = false,
  onLoadMore,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = moment(message.created_at).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  const sortedDates = Object.keys(groupedMessages).sort();

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-[250px] rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return <EmptyMessages />;
  }

  return (
    <ScrollArea className="flex-1 pt-2 w-full" ref={scrollRef}>
      <div className="px-2 md:px-4 w-full">
        {/* Load More Trigger */}
        {hasMore && <LoadMoreTrigger onLoadMore={onLoadMore} loading={loading} />}

        {/* Messages grouped by date */}
        {sortedDates.map((date) => {
          const dateMessages = groupedMessages[date];
          return (
            <div key={date}>
              <DateDivider date={date} />
              {dateMessages.map((message, index) => {
                const prevMessage = dateMessages[index - 1];
                const showAvatar =
                  !prevMessage || prevMessage.sender_id !== message.sender_id;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender_id === currentUserId}
                    isGroupChat={isGroupChat}
                    showAvatar={showAvatar}
                    currentUserId={currentUserId}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Auto-scroll anchor */}
        <div ref={bottomRef} className="h-1" />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
