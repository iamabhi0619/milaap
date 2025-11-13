'use client';

import React from 'react';
import { IconX, IconFile, IconPhoto, IconVideo, IconMusic, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Attachment } from './types';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemove,
}) => {
  if (attachments.length === 0) return null;

  const getIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image':
        return IconPhoto;
      case 'video':
        return IconVideo;
      case 'audio':
        return IconMusic;
      default:
        return IconFile;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-start gap-2 overflow-x-auto custom-scrollbar pb-2">
        {attachments.map((attachment) => {
          const Icon = getIcon(attachment.type);

          return (
            <div
              key={attachment.id}
              className={cn(
                "relative shrink-0 rounded-lg overflow-hidden",
                "border border-border bg-muted/50",
                "group"
              )}
            >
              {attachment.type === 'image' ? (
                <div className="relative w-20 h-20">
                  <Image
                    src={attachment.preview}
                    alt={attachment.name}
                    fill
                    className="object-cover"
                  />
                  {/* Upload Status Overlay */}
                  {attachment.uploadStatus !== 'success' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      {attachment.uploadStatus === 'uploading' && (
                        <div className="flex flex-col items-center gap-1">
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                          <div className="text-white text-xs font-medium">
                            {attachment.uploadProgress || 0}%
                          </div>
                        </div>
                      )}
                      {attachment.uploadStatus === 'error' && (
                        <IconAlertCircle className="h-6 w-6 text-red-500" />
                      )}
                      {attachment.uploadStatus === 'idle' && (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      )}
                    </div>
                  )}
                  {/* Success Indicator */}
                  {attachment.uploadStatus === 'success' && (
                    <div className="absolute top-1 left-1 bg-green-500 rounded-full p-0.5">
                      <IconCheck className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 flex flex-col items-center justify-center p-2 relative">
                  <Icon className="h-8 w-8 text-muted-foreground mb-1" />
                  <span className="text-xs text-center line-clamp-2 text-muted-foreground">
                    {attachment.name}
                  </span>

                  {/* Upload Status for non-image files */}
                  {attachment.uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin mb-1" />
                      <div className="text-white text-xs font-medium">
                        {attachment.uploadProgress || 0}%
                      </div>
                    </div>
                  )}
                  {attachment.uploadStatus === 'error' && (
                    <div className="absolute top-1 right-1">
                      <IconAlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                  {attachment.uploadStatus === 'success' && (
                    <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                      <IconCheck className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove(attachment.id)}
                className={cn(
                  "absolute top-1 right-1 h-5 w-5 rounded-full",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "shadow-lg"
                )}
              >
                <IconX className="h-3 w-3" />
              </Button>

              {attachment.type !== 'image' && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 text-center">
                  {formatSize(attachment.size)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
