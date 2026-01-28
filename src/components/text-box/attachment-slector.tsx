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
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import useMessageBoxStore from './messangingStore';

interface AttachmentOption {
    id: string;
    icon: React.ElementType;
    label: string;
    description: string;
    color: string;
    bgColor: string;
    accept: string;
    capture?: boolean;
    multiple?: boolean;
    ref: React.RefObject<HTMLInputElement | null>;
}

interface AttachmentSelectorProps {
    disabled?: boolean;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number; // in MB
}


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

    // Refs for file inputs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const anyFileInputRef = useRef<HTMLInputElement>(null);

    const { addAttachment } = useMessageBoxStore();

    const validateFiles = (files: File[]): File[] => {
        const maxSizeBytes = maxFileSize * 1024 * 1024;

        return files.filter((file) => {
            if (file.size > maxSizeBytes) {
                console.warn(`File ${file.name} exceeds ${maxFileSize}MB limit`);
                return false;
            }
            return true;
        }).slice(0, maxFiles);
    };

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
                const validFiles = validateFiles(files);
                if (validFiles.length > 0) {
                    await addAttachment(validFiles);
                    setOpen(false);
                }
            }
            // Reset input
            e.target.value = '';
        },
        [addAttachment, setOpen, maxFiles, maxFileSize]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                const validFiles = validateFiles(files);
                if (validFiles.length > 0) {
                    await addAttachment(validFiles);
                    setOpen(false);
                }
            }
        },
        [addAttachment, setOpen, maxFiles, maxFileSize]
    );

    const attachmentOptions: AttachmentOption[] = [
        {
            id: 'image',
            icon: IconPhoto,
            label: 'Photos',
            description: 'JPG, PNG, GIF',
            color: 'text-primary',
            bgColor: 'bg-primary/5 hover:bg-primary/10',
            accept: 'image/*',
            multiple,
            ref: imageInputRef,
        },
        {
            id: 'video',
            icon: IconVideo,
            label: 'Videos',
            description: 'MP4, MOV, AVI',
            color: 'text-primary',
            bgColor: 'bg-accent/30 hover:bg-accent/50',
            accept: 'video/*',
            multiple,
            ref: videoInputRef,
        },
        {
            id: 'audio',
            icon: IconMusic,
            label: 'Audio',
            description: 'MP3, WAV, OGG',
            color: 'text-primary',
            bgColor: 'bg-muted hover:bg-muted/80',
            accept: 'audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac',
            multiple,
            ref: audioInputRef,
        },
        {
            id: 'camera',
            icon: IconCamera,
            label: 'Camera',
            description: 'Take photo',
            color: 'text-primary',
            bgColor: 'bg-secondary hover:bg-secondary/80',
            accept: 'image/*',
            capture: true,
            multiple: false,
            ref: cameraInputRef,
        },
        {
            id: 'document',
            icon: IconFileText,
            label: 'Documents',
            description: 'PDF, DOC, TXT',
            color: 'text-foreground',
            bgColor: 'bg-accent/30 hover:bg-accent/50',
            accept: '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx',
            multiple,
            ref: documentInputRef,
        },
        {
            id: 'file',
            icon: IconFile,
            label: 'Files',
            description: 'Any file type',
            color: 'text-muted-foreground',
            bgColor: 'bg-muted/50 hover:bg-muted',
            accept: '*/*',
            multiple,
            ref: anyFileInputRef,
        },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    disabled={disabled}
                    className={cn(
                        'rounded-full p-1.5 transition-all duration-300 ease-out',
                        'hover:bg-primary/10 hover:text-primary hover:scale-110',
                        'active:scale-95',
                        open && 'bg-primary/15 text-primary scale-110 shadow-sm',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        disabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                    aria-label="Attach files"
                >
                    <IconPaperclip className={cn(
                        "size-5 transition-transform duration-300",
                        open && "rotate-45"
                    )} />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="start"
                className="w-[360px] p-5 shadow-xl border-border/60 backdrop-blur-sm bg-card/95"
                sideOffset={16}
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-base flex items-center gap-2">
                            <IconCloudUpload className="size-5 text-primary" />
                            Attach Files
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {multiple
                                ? `Select up to ${maxFiles} files (max ${maxFileSize}MB each)`
                                : `Select a file (max ${maxFileSize}MB)`}
                        </p>
                    </div>

                    <Separator />

                    {/* Drag & Drop Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            'relative rounded-xl border-2 border-dashed transition-all duration-300',
                            'p-8 text-center cursor-pointer group',
                            isDragging
                                ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20'
                                : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-accent/50 hover:scale-[1.01]'
                        )}
                        onClick={() => anyFileInputRef.current?.click()}
                    >
                        <IconCloudUpload
                            className={cn(
                                'mx-auto size-10 mb-3 transition-all duration-300',
                                isDragging 
                                    ? 'text-primary scale-110 animate-bounce' 
                                    : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'
                            )}
                        />
                        <p className="text-sm font-semibold mb-1.5 transition-colors">
                            {isDragging ? 'Drop files here' : 'Drop files or click to browse'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports all file types
                        </p>
                    </div>

                    <Separator />

                    {/* Quick Actions Grid */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            Quick Select
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {attachmentOptions.map((option) => (
                                <div key={option.id}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => option.ref.current?.click()}
                                        disabled={disabled}
                                        className={cn(
                                            'w-full h-auto flex flex-col items-start gap-2 p-3.5',
                                            'transition-all duration-300 hover:text-foreground',
                                            option.bgColor,
                                            'border border-border/40 hover:border-primary/50',
                                            'active:scale-95 hover:scale-[1.02]',
                                            'rounded-lg shadow-sm hover:shadow-md',
                                            'relative overflow-hidden',
                                            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
                                        )}
                                    >
                                        <option.icon className={cn('size-6', option.color, 'transition-transform duration-300 group-hover:scale-110')} />
                                        <div className="text-left space-y-0.5 relative z-10">
                                            <div className="text-xs font-bold">{option.label}</div>
                                            <div className="text-[10px] font-medium text-muted-foreground">
                                                {option.description}
                                            </div>
                                        </div>
                                    </Button>
                                    <input
                                        ref={option.ref}
                                        type="file"
                                        accept={option.accept}
                                        multiple={option.multiple}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        capture={option.capture ? 'environment' : undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AttachmentSelector;