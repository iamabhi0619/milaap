"use client";

import React from "react";
import { Message } from "@/types/table";
import InlineImagePreview from "./InlineImagePreview";
import VoiceMessage from "./VoiceMessage";
import FileAttachmentCard from "./FileAttachmentCard";

interface MessageAttachmentsProps {
  message: Message;
  isOwn?: boolean;
}
interface AttProps {
  id: string;
  file_url: string;
  file_type?: string | null;
  file_name?: string | null;
  name?: string;
  size?: number;
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ message, isOwn = false }) => {
  const attachments = [...(message.attachments || [])];
  const hasAttachments = attachments.length > 0 || message.image_url || message.voice_url;

  if (!hasAttachments) return null;

  return (
    <div className="mt-3 space-y-2.5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Inline Image with Lightbox (only for message.image_url) */}
      {message.image_url && (
        <InlineImagePreview imageUrl={message.image_url} isOwn={isOwn} />
      )}

      {/* Voice Message */}
      {message.voice_url && (
        <VoiceMessage voiceUrl={message.voice_url} isOwn={isOwn} />
      )}

      {/* File Attachments (all types including images) */}
      {attachments.length > 0 && (
        <div className="space-y-2 pb-2">
          {attachments.map((att: AttProps) => (
            <FileAttachmentCard
              key={att.id}
              attachment={att}
              isOwn={isOwn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageAttachments;
