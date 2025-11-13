"use client";

import React from "react";
import { Message } from "@/types/table";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";

interface MessageReplyProps {
  replyMessage?: Message;
  isOwn: boolean;
}

const MessageReply: React.FC<MessageReplyProps> = ({ replyMessage, isOwn }) => {
  if (!replyMessage) return null;

  return (
    <div
      className={cn(
        "mb-2 p-2 rounded-lg border-l-4 bg-secondary/50 max-w-full",
        isOwn ? "border-l-primary" : "border-l-secondary"
      )}
    >
      <div className="flex items-center gap-1 mb-1">
        <Reply className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">
          {replyMessage.sender?.name || "Unknown"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {replyMessage.text || "Media message"}
      </p>
    </div>
  );
};

export default MessageReply;
