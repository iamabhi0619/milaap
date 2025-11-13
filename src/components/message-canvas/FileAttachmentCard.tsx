"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { IconDownload, IconFile3d, IconImageInPicture, IconMusic, IconVideo } from "@tabler/icons-react";

interface FileAttachmentCardProps {
    attachment: {
        id: string;
        file_url: string;
        file_type?: string | null;
        file_name?: string | null;
        name?: string;
        size?: number;
    };
    isOwn?: boolean;
}

const formatBytes = (bytes?: number) => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let val = bytes;
    while (val >= 1024 && i < units.length - 1) {
        val /= 1024;
        i++;
    }
    return `${val.toFixed(val < 10 ? 2 : 1)} ${units[i]}`;
};

const FileAttachmentCard: React.FC<FileAttachmentCardProps> = ({ attachment, isOwn = false }) => {
    const ft = (attachment.file_type || "").toLowerCase();
    const isImage = ft.includes("image") || ft.startsWith("image");
    const isAudio = ft.includes("audio") || ft.startsWith("audio");
    const isVideo = ft.includes("video") || ft.startsWith("video");
    const fileName = attachment.file_name || attachment.name || attachment.file_type || "File";

    let FileTypeIcon = IconFile3d;
    let iconBg = "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400";
    let typeLabel = "Document";

    if (isImage) {
        FileTypeIcon = IconImageInPicture;
        iconBg = "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400";
        typeLabel = "Image";
    } else if (isAudio) {
        FileTypeIcon = IconMusic;
        iconBg = "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400";
        typeLabel = "Audio";
    } else if (isVideo) {
        FileTypeIcon = IconVideo;
        iconBg = "bg-pink-500/10 text-pink-600 dark:bg-pink-400/10 dark:text-pink-400";
        typeLabel = "Video";
    }

    return (
        <Card
            className={cn(
                "group border-2 p-0 transition-all duration-200 hover:shadow-md",
                isOwn
                    ? "bg-primary/5 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
                    : "bg-muted/30 border-border/30 hover:border-border hover:bg-muted/50"
            )}
        >
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    <div className={cn("flex items-center justify-center h-11 w-11 rounded-xl shrink-0 transition-all", iconBg, "group-hover:scale-105")}>
                        <FileTypeIcon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate mb-1">{fileName}</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                                {typeLabel}
                            </Badge>
                            {attachment.size && (
                                <span className="text-xs text-muted-foreground font-medium">
                                    {formatBytes(attachment.size)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a href={attachment.file_url} download={fileName}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full opacity-60 group-hover:opacity-100 hover:bg-primary/10 transition-all"
                                    >
                                        <IconDownload className="h-4 w-4" />
                                    </Button>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>Download</TooltipContent>
                        </Tooltip>

                        {/* <Tooltip>
              <TooltipTrigger asChild>
                <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full opacity-60 group-hover:opacity-100 hover:bg-primary/10 transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Open</TooltipContent>
            </Tooltip> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FileAttachmentCard;
