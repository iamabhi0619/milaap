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
    <div
      className={cn(
        "text-base tracking-wide leading-6 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-sm [&_code]:bg-background/50 [&_code]:px-1 [&_code]:py-0.5 [&_p]:m-0 [&_strong]:font-semibold",
        isOwn
          ? "text-primary-foreground [&_a]:text-primary-foreground"
          : "text-foreground [&_a]:text-foreground"
      )}
    >
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
