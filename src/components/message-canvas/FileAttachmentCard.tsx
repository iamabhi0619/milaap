"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    IconDownload,
    IconFileUnknown,
    IconPhoto,
    IconMusic,
    IconVideo,
    IconFileTypePdf,
    IconFileTypeDoc,
    IconFileTypeXls,
    IconFileTypeZip,
    IconExternalLink,
} from "@tabler/icons-react";

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
    if (!bytes) return null;
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let val = bytes;
    while (val >= 1024 && i < units.length - 1) { val /= 1024; i++; }
    return `${val.toFixed(val < 10 ? 2 : 1)} ${units[i]}`;
};

type FileKind = "image" | "audio" | "video" | "pdf" | "doc" | "xls" | "zip" | "other";

const detectKind = (ft: string, name: string): FileKind => {
    const t = ft.toLowerCase();
    const n = name.toLowerCase();
    if (t.startsWith("image")) return "image";
    if (t.startsWith("audio")) return "audio";
    if (t.startsWith("video")) return "video";
    if (t.includes("pdf") || n.endsWith(".pdf")) return "pdf";
    if (t.includes("word") || n.match(/\.(doc|docx)$/)) return "doc";
    if (t.includes("excel") || t.includes("spreadsheet") || n.match(/\.(xls|xlsx|csv)$/)) return "xls";
    if (t.includes("zip") || t.includes("archive") || n.match(/\.(zip|rar|tar|gz|7z)$/)) return "zip";
    return "other";
};

const KIND_META: Record<FileKind, { icon: React.ElementType; label: string; iconClass: string; bgClass: string }> = {
    image: { icon: IconPhoto, label: "Image", iconClass: "text-primary", bgClass: "bg-primary/10" },
    audio: { icon: IconMusic, label: "Audio", iconClass: "text-secondary-foreground", bgClass: "bg-secondary" },
    video: { icon: IconVideo, label: "Video", iconClass: "text-accent-foreground", bgClass: "bg-accent" },
    pdf: { icon: IconFileTypePdf, label: "PDF", iconClass: "text-destructive", bgClass: "bg-destructive/10" },
    doc: { icon: IconFileTypeDoc, label: "Document", iconClass: "text-primary", bgClass: "bg-primary/10" },
    xls: { icon: IconFileTypeXls, label: "Spreadsheet", iconClass: "text-primary", bgClass: "bg-primary/10" },
    zip: { icon: IconFileTypeZip, label: "Archive", iconClass: "text-muted-foreground", bgClass: "bg-muted" },
    other: { icon: IconFileUnknown, label: "File", iconClass: "text-muted-foreground", bgClass: "bg-muted" },
};

const FileAttachmentCard: React.FC<FileAttachmentCardProps> = ({ attachment, isOwn = false }) => {
    const fileName = attachment.file_name || attachment.name || "File";
    const kind = detectKind(attachment.file_type || "", fileName);
    const { icon: KindIcon, label, iconClass, bgClass } = KIND_META[kind];
    const sizeStr = formatBytes(attachment.size);

    return (
        <Card className={cn(
            "group p-0 transition-all duration-200 border w-2xs",
            isOwn
                ? "bg-primary/5 border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                : "bg-card border-border hover:border-border/80 hover:bg-muted/40"
        )}>
            <CardContent className="p-0">
                <div className="flex items-stretch gap-0">
                    {/* Coloured icon strip */}
                    <div className={cn(
                        "flex items-center justify-center w-14 rounded-l-xl shrink-0 transition-all duration-200 group-hover:w-16",
                        bgClass
                    )}>
                        <KindIcon className={cn("h-6 w-6 transition-transform duration-200 group-hover:scale-110", iconClass)} />
                    </div>

                    <Separator orientation="vertical" className="h-auto" />

                    {/* File info */}
                    <div className="flex-1 min-w-0 px-3 py-2.5">
                        <p className="text-sm font-semibold text-foreground truncate leading-tight mb-1">
                            {fileName}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium h-4">
                                {label}
                            </Badge>
                            {sizeStr && (
                                <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
                                    {sizeStr}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center justify-center gap-1 px-2 shrink-0">
                        <Tooltip>
                            <TooltipTrigger>
                                <a
                                    href={attachment.file_url}
                                    download={fileName}
                                    aria-label="Download"
                                    className="flex items-center justify-center h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    <IconDownload className="h-4 w-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="left">Download</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <a
                                    href={attachment.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open in new tab"
                                    className="flex items-center justify-center h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    <IconExternalLink className="h-4 w-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="left">Open</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FileAttachmentCard;
