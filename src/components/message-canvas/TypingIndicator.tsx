"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  users: Array<{ name: string; avatar?: string }>;
}

const dotVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <Avatar className="h-6 w-6">
        <AvatarImage src={users[0].avatar} alt={users[0].name} />
        <AvatarFallback className="text-xs">
          {users[0].name[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="bg-secondary rounded-2xl px-4 py-2 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.15 }}
            className="w-2 h-2 rounded-full bg-muted-foreground"
          />
        ))}
      </div>

      <span className="text-xs text-muted-foreground">
        {users.length === 1
          ? `${users[0].name} is typing...`
          : `${users.length} people are typing...`}
      </span>
    </motion.div>
  );
};

export default TypingIndicator;
