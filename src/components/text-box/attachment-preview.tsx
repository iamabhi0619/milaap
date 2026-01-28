'use client';

import React from 'react';
import {
    IconX,
    IconFile,
    IconPhoto,
    IconVideo,
    IconMusic,
    IconFileText,
    IconPdf,
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useMessageBoxStore from './messangingStore';
import { Progress } from '../ui/progress';

interface AttachmentPreviewProps {
    className?: string;
}

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return IconPhoto;
    if (fileType.startsWith('video/')) return IconVideo;
    if (fileType.startsWith('audio/')) return IconMusic;
    if (fileType === 'application/pdf') return IconPdf;
    if (fileType.includes('document') || fileType.includes('text')) return IconFileText;
    return IconFile;
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileTypeLabel = (fileType: string): string => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Audio';
    if (fileType === 'application/pdf') return 'PDF';
    if (fileType.includes('document')) return 'Document';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Spreadsheet';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation';
    return 'File';
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ className }) => {
    const { attachments, removeAttachment, fileUploadProgress } = useMessageBoxStore();

    if (!attachments || attachments.length === 0) {
        return null;
    }

    const uploadProgressEntries = Object.entries(fileUploadProgress);
    const isUploading = uploadProgressEntries.length > 0;

    return (
        <div className={cn('space-y-3 p-4 bg-linear-to-br from-muted/40 via-muted/20 to-transparent rounded-xl border border-border/50 backdrop-blur-sm shadow-sm', className)}>
            {/* Upload Progress Banner */}
            {isUploading && (
                <div className="space-y-2.5 p-3.5 bg-linear-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/30 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-semibold text-primary">
                                Uploading {uploadProgressEntries.length} file(s)...
                            </span>
                        </div>
                        <span className="text-xs font-medium tabular-nums text-primary/80">
                            {Math.round(
                                uploadProgressEntries.reduce((acc, [, progress]) => acc + progress, 0) /
                                uploadProgressEntries.length
                            )}%
                        </span>
                    </div>
                    {uploadProgressEntries.map(([fileId, progress]) => (
                        <div key={fileId} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-foreground/80 truncate max-w-[200px]">
                                    {fileId.split('-')[0]}
                                </span>
                                <span className="font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5 bg-primary/10" />
                        </div>
                    ))}
                </div>
            )}

            {/* Attachment Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[430px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 pr-1">
                {attachments.map((attachment) => {
                    const fileType = attachment.type || '';
                    const Icon = getFileIcon(fileType);
                    const isImage = fileType.startsWith('image/');
                    const isVideo = fileType.startsWith('video/');

                    return (
                        <div
                            key={attachment.id}
                            className={cn(
                                'group relative rounded-xl border border-border/60 bg-linear-to-br from-card to-card/50 overflow-hidden',
                                'transition-all duration-300 ease-out',
                                'hover:border-primary/60 ',
                                'animate-in fade-in zoom-in-95 duration-300'
                            )}
                        >
                            {/* Preview Area */}
                            <div className="aspect-square relative bg-linear-to-br from-muted/60 to-muted/30">
                                {isImage ? (
                                    <>
                                        <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </>
                                ) : isVideo ? (
                                    <>
                                        <video
                                            src={attachment.url}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            muted
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon className="size-12 text-muted-foreground/60 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                                    </div>
                                )}

                                {/* Remove Button */}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className={cn(
                                        'absolute top-2 right-2 size-7 rounded-full',
                                        'opacity-0 group-hover:opacity-100 transition-all duration-300',
                                        'shadow-lg hover:shadow-xl backdrop-blur-sm',
                                        'hover:scale-110 active:scale-95'
                                    )}
                                    onClick={() => attachment.id && removeAttachment(attachment.id)}
                                >
                                    <IconX className="size-3.5" />
                                </Button>

                                {/* File Type Badge */}
                                <div className="absolute bottom-2 left-2">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-linear-to-r from-black/80 to-black/60 text-white backdrop-blur-sm shadow-md border border-white/10">
                                        {getFileTypeLabel(fileType)}
                                    </span>
                                </div>
                            </div>

                            {/* File Info */}
                            <div className="p-3 space-y-1 bg-linear-to-b from-transparent to-muted/20">
                                <p className="text-xs font-semibold truncate leading-tight" title={attachment.name}>
                                    {attachment.name}
                                </p>
                                <p className="text-[10px] font-medium text-muted-foreground/80">
                                    {formatFileSize(attachment.size)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {attachments.length}
                    </span>
                    <span>
                        {attachments.length === 1 ? 'file' : 'files'} •
                        <span className="font-bold text-foreground/80"> {formatFileSize(attachments.reduce((acc, att) => acc + att.size, 0))}</span>
                    </span>
                </span>
                {!isUploading && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                        onClick={() => {
                            attachments.forEach((att) => att.id && removeAttachment(att.id));
                        }}
                    >
                        Clear all
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AttachmentPreview;
