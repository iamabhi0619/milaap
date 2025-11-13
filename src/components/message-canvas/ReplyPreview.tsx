"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/types/table";

interface ReplyPreviewProps {
  message: Message | null;
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, onCancel }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="px-4 py-2 bg-secondary/50 border-t border-l-4 border-l-primary flex items-center justify-between"
      >
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-primary mb-1">
            Replying to {message.sender?.name || "Unknown"}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {message.text || "Media message"}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 shrink-0 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReplyPreview;
