"use client";

import React from "react";
import { Message } from "@/types/table";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  message: Message;
  isOwn: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ message, isOwn }) => {
  if (message.deleted) {
    return <span className="text-sm italic">This message was deleted</span>;
  }

  if (!message.text) return null;

  // Check if message has formatting (markdown-like)
  const hasFormatting = /(\*\*|__|~~|`)/.test(message.text);

  return (
    <div className={cn("text-sm", isOwn ? "text-primary-foreground" : "text-foreground")}>
      {hasFormatting ? (
        <ReactMarkdown>
          {message.text}
        </ReactMarkdown>
      ) : (
        <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
      )}
    </div>
  );
};

export default MessageContent;
