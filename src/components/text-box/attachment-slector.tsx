'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
    IconPaperclip,
    IconPhoto,
    IconFile,
    IconVideo,
    IconCamera,
    IconMusic,
    IconFileText,
    IconCloudUpload,
    IconSend2,
    IconLoader2,
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import useMessageBoxStore from './messangingStore';

interface AttachmentSelectorProps {
    disabled?: boolean;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
}

const ATTACHMENT_OPTIONS = [
    { id: 'image',    icon: IconPhoto,    label: 'Photos',    accept: 'image/*',                                  multiple: true  },
    { id: 'video',    icon: IconVideo,    label: 'Videos',    accept: 'video/*',                                  multiple: true  },
    { id: 'audio',    icon: IconMusic,    label: 'Audio',     accept: 'audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac',   multiple: true  },
    { id: 'document', icon: IconFileText, label: 'Docs',      accept: '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx', multiple: true },
    { id: 'camera',   icon: IconCamera,   label: 'Camera',    accept: 'image/*',                                  multiple: false, capture: true },
    { id: 'file',     icon: IconFile,     label: 'Any file',  accept: '*/*',                                      multiple: true  },
] as const;

const AttachmentSelector: React.FC<AttachmentSelectorProps> = ({
    disabled = false,
    isOpen,
    onOpenChange,
    className,
    multiple = true,
    maxFiles = 10,
    maxFileSize = 100,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);

    const open = isOpen !== undefined ? isOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const refs = {
        image:    useRef<HTMLInputElement>(null),
        video:    useRef<HTMLInputElement>(null),
        audio:    useRef<HTMLInputElement>(null),
        document: useRef<HTMLInputElement>(null),
        camera:   useRef<HTMLInputElement>(null),
        file:     useRef<HTMLInputElement>(null),
    };

    const { addAttachment, sendMessage, attachments, isSending } = useMessageBoxStore();
    const stagedCount = attachments?.length ?? 0;

    const validateFiles = (files: File[]) => {
        const maxBytes = maxFileSize * 1024 * 1024;
        return files.filter(f => f.size <= maxBytes).slice(0, maxFiles);
    };

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const valid = validateFiles(files);
            if (valid.length > 0) await addAttachment(valid);
        }
        e.target.value = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addAttachment, maxFiles, maxFileSize]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const valid = validateFiles(files);
            if (valid.length > 0) await addAttachment(valid);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addAttachment, maxFiles, maxFileSize]);

    const handleSend = async () => {
        await sendMessage();
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={(
                <button
                    disabled={disabled}
                    className={cn(
                        'relative rounded-full p-1.5 transition-all duration-200',
                        'hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95',
                        open && 'bg-primary/15 text-primary scale-110',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        disabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                    aria-label="Attach files"
                >
                    <IconPaperclip className={cn('size-5 transition-transform duration-200', open && 'rotate-45')} />
                    {stagedCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                            {stagedCount}
                        </span>
                    )}
                </button>
            )}>
            </PopoverTrigger>

            <PopoverContent side="top" align="start" sideOffset={12} className="w-72 p-3">
                <div className="space-y-3">
                    {/* Quick-pick grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                        {ATTACHMENT_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const ref = refs[opt.id as keyof typeof refs];
                            return (
                                <React.Fragment key={opt.id}>
                                    <button
                                        onClick={() => ref.current?.click()}
                                        disabled={disabled}
                                        className={cn(
                                            'flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-150',
                                            'border border-border/50 bg-muted/40',
                                            'hover:bg-primary/10 hover:border-primary/40 hover:text-primary',
                                            'active:scale-95 text-muted-foreground',
                                            disabled && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        <Icon className="size-5" />
                                        <span className="text-[10px] font-semibold">{opt.label}</span>
                                    </button>
                                    <input
                                        ref={ref}
                                        type="file"
                                        accept={opt.accept}
                                        multiple={'multiple' in opt ? opt.multiple && multiple : multiple}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        capture={'capture' in opt && opt.capture ? 'environment' : undefined}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <Separator />

                    {/* Drag & drop zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => refs.file.current?.click()}
                        className={cn(
                            'flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed py-4 cursor-pointer transition-all duration-200',
                            isDragging
                                ? 'border-primary bg-primary/10 scale-[1.02]'
                                : 'border-border hover:border-primary/50 hover:bg-muted/40'
                        )}
                    >
                        <IconCloudUpload className={cn('size-6 transition-colors', isDragging ? 'text-primary' : 'text-muted-foreground')} />
                        <p className="text-xs text-muted-foreground">
                            {isDragging ? 'Drop to attach' : 'Drop files here'}
                        </p>
                    </div>

                    {/* Send button — only when attachments are staged */}
                    {stagedCount > 0 && (
                        <>
                            <Separator />
                            <Button
                                className="w-full gap-2"
                                size="sm"
                                onClick={handleSend}
                                disabled={isSending}
                            >
                                {isSending
                                    ? <IconLoader2 className="size-4 animate-spin" />
                                    : <IconSend2 className="size-4" />
                                }
                                Send
                                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">
                                    {stagedCount}
                                </Badge>
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AttachmentSelector;