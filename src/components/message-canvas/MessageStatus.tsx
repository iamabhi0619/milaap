"use client";

import React from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageStatusProps {
  status: "sent" | "delivered" | "seen";
  timestamp: string;
  className?: string;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, timestamp, className }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "seen":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center gap-1", className)}
    >
      <span className="text-xs text-muted-foreground">
        {moment.utc(timestamp).local().format('h:mm A')}
      </span>
      {getStatusIcon()}
    </motion.div>
  );
};

export default MessageStatus;
