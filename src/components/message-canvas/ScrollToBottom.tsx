"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScrollToBottomProps {
  onClick: () => void;
  unreadCount?: number;
  show: boolean;
}

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ onClick, unreadCount = 0, show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-20 right-4 z-10"
    >
      <Button
        onClick={onClick}
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg relative"
      >
        <ArrowDown className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </motion.div>
  );
};

export default ScrollToBottom;
