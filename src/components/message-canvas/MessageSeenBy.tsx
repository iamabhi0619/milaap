"use client";

import React from "react";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface MessageSeenByProps {
  seenBy: Array<{
    id: string;
    name: string;
    avatar?: string;
    seenAt: string;
  }>;
}

const MessageSeenBy: React.FC<MessageSeenByProps> = ({ seenBy }) => {
  if (seenBy.length === 0) return null;

  return (
    <div className="p-4 border-t">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Check className="h-4 w-4 text-blue-500" />
        Seen by {seenBy.length}
      </h3>
      <ScrollArea className="max-h-60">
        <div className="space-y-2">
          {seenBy.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {moment.utc(user.seenAt).local().format('h:mm A')}
              </span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageSeenBy;
