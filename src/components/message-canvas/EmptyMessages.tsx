"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const EmptyMessages: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center text-center p-8"
    >
      <div className="rounded-full bg-secondary p-6 mb-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Start the conversation by sending the first message!
      </p>
    </motion.div>
  );
};

export default EmptyMessages;
