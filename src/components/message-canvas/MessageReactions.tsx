"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reaction } from "@/types/table";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  currentUserId: string;
  isOwn: boolean;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  currentUserId,
  isOwn,
}) => {
  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  return (
    <div className={cn("flex gap-1 mt-1 flex-wrap", isOwn ? "justify-end" : "justify-start")}>
      {Object.entries(groupedReactions).map(([emoji, emojiReactions]) => {
        const userReacted = emojiReactions.some((r) => r.user_id === currentUserId);
        const count = emojiReactions.length;

        return (
          <Popover key={emoji}>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={userReacted ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer px-2 py-0.5 text-xs flex items-center gap-1",
                    userReacted && "ring-2 ring-primary"
                  )}
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </Badge>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="text-sm">
                {emojiReactions.map((reaction) => (
                  <div key={reaction.id} className="flex items-center gap-2 py-1">
                    <span>{emoji}</span>
                    <span>{reaction.user?.name || "Unknown"}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
};

export default MessageReactions;
