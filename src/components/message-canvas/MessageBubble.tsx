"use client";

import React from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Message } from "@/types/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MessageContent from "./MessageContent";
// import MessageActions from "./MessageActions";
// import MessageReactions from "./MessageReactions";
// import MessageContent from "./MessageContent";
import MessageAttachments from "./MessageAttachments";
// import MessageReply from "./MessageReply";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isGroupChat: boolean;
  showAvatar?: boolean;
  currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  isGroupChat,
  showAvatar = true,
}) => {
  // const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-2 mb-4 group", isOwn ? "flex-row-reverse" : "flex-row")}
      // onMouseEnter={() => setShowActions(true)}
      // onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar - only show in group chats for others' messages */}
      {isGroupChat && !isOwn && showAvatar && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender?.avatar || ""} alt={message.sender?.name || "User"} />
          <AvatarFallback>{message.sender?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      )}

      {/* Spacer for alignment in group chats */}
      {isGroupChat && !isOwn && !showAvatar && <div className="w-8 shrink-0" />}

      {/* Message Container */}
      <div className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%]",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender Name (only in group chats for others' messages) */}
        {isGroupChat && !isOwn && (
          <span className="text-xs text-muted-foreground mb-1 px-2">
            {message.sender?.name || "Unknown"}
          </span>
        )}

        {/* Reply Preview */}
        {/* {message.reply_to && <MessageReply replyMessage={message.reply_message} isOwn={isOwn} />} */}

        {/* Attachments (images, voice notes) - Show before message bubble if present */}
        {(message.image_url || message.voice_url || (message.attachments && message.attachments.length > 0)) && (
          <MessageAttachments message={message} isOwn={isOwn} />
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative rounded-2xl shadow-sm wrap-break-word",
            message.text ? 'px-3 py-2 sm:px-4' : 'p-0',
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-secondary text-secondary-foreground rounded-bl-none",
            message.deleted && "opacity-50 italic"
          )}
        >
          {/* Message Content (text, formatted text) */}
          <MessageContent message={message} isOwn={isOwn} />

          {/* Edited Badge */}
          {message.edited && !message.deleted && (
            <Badge variant="outline" className="mt-1 text-xs">
              Edited
            </Badge>
          )}
        </div>

        {/* Message Reactions */}
        {/* {message.reactions && message.reactions.length > 0 && (
          <MessageReactions
            reactions={message.reactions}
            messageId={message.id}
            currentUserId={currentUserId}
            isOwn={isOwn}
          />
        )} */}

        {/* Timestamp & Status */}
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {moment.utc(message.created_at).local().format('h:mm A')}
          {isOwn && message.seen_by && message.seen_by.length > 1 && " • Seen"}
        </span>
      </div>

      {/* Message Actions (Reply, React, Delete, etc.) */}
      {/* <AnimatePresence>
        {showActions && (
          <MessageActions
            message={message}
            isOwn={isOwn}
            onReply={() => console.log("Reply to:", message.id)}
            onReact={() => console.log("React to:", message.id)}
            onDelete={() => console.log("Delete:", message.id)}
            onEdit={() => console.log("Edit:", message.id)}
          />
        )}
      </AnimatePresence> */}
    </motion.div>
  );
};

export default MessageBubble;
