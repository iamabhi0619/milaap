"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reply, Smile, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message } from "@/types/table";

interface MessageActionsProps {
  message: Message;
  isOwn: boolean;
  onReply: () => void;
  onReact: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  isOwn,
  onReply,
  onReact,
  onDelete,
  onEdit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-1"
    >
      {/* Quick Actions */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onReply}
        title="Reply"
      >
        <Reply className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onReact}
        title="React"
      >
        <Smile className="h-4 w-4" />
      </Button>

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isOwn ? "end" : "start"}>
          {isOwn && !message.deleted && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
          {!isOwn && (
            <DropdownMenuItem>Report</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default MessageActions;
