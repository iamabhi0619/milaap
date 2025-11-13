'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconPhoto, IconSend } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useInputBoxState } from './hooks/useInputBoxState';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import { InputBoxProps, SendMessageData } from './types';
import { AttachmentButton } from './AttachmentButton';
import { EmojiButton } from './EmojiButton';
import { VoiceRecordButton } from './VoiceRecordButton';
import { TextInput } from './TextInput';
import { AttachmentPreview } from './AttachmentPreview';
import { ReplyPreview } from './ReplyPreview';
import { VoiceRecordingPreview } from './VoiceRecordingPreview';
import { useMessageStore } from '@/stores/message';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/cloudinary';

const InputBox: React.FC<InputBoxProps> = ({
    chatId,
    disabled = false,
    placeholder = 'Type a message...',
    maxLength = 4000,
    onSend,
}) => {
    const { state, actions } = useInputBoxState();
    const voiceRecording = useVoiceRecording();
    const [isLoading, setIsLoading] = useState(false);
    const { sendMessage } = useMessageStore();
    const { user } = useUserStore();
    const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
    const [inlineImageId, setInlineImageId] = useState<string | null>(null);
    const inputContainerRef = useRef<HTMLDivElement | null>(null);

    const hasContent = Boolean(
        state.text.trim() ||
        state.attachments.length > 0 ||
        voiceRecording.recording
    );

    const isTyping = state.text.trim().length > 0;

    // Auto-scroll to keep input visible when keyboard opens on mobile
    useEffect(() => {
        if (state.isFocused) {
            const scrollInputIntoView = () => {
                // Scroll to the absolute bottom of the page with extra padding
                const scrollHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                const extraPadding = 100; // Extra pixels to ensure full visibility

                window.scrollTo({
                    top: scrollHeight - windowHeight + extraPadding,
                    behavior: 'smooth'
                });

                // Also try scrollIntoView as backup
                if (inputContainerRef.current) {
                    inputContainerRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                }
            };

            // Multiple timeouts to handle keyboard animation
            const timer1 = setTimeout(scrollInputIntoView, 100);
            const timer2 = setTimeout(scrollInputIntoView, 300);
            const timer3 = setTimeout(scrollInputIntoView, 600);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [state.isFocused]);

    // Also scroll when typing starts
    useEffect(() => {
        if (isTyping && state.isFocused) {
            const scrollToBottom = () => {
                const scrollHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                const extraPadding = 100;

                window.scrollTo({
                    top: scrollHeight - windowHeight + extraPadding,
                    behavior: 'smooth'
                });
            };
            const timer = setTimeout(scrollToBottom, 100);
            return () => clearTimeout(timer);
        }
    }, [isTyping, state.isFocused]);

    const handleEmojiSelect = useCallback((emoji: string) => {
        actions.setText(state.text + emoji);
        actions.toggleEmojiPicker();
    }, [state.text, actions]);

    const handleFileSelect = useCallback(async (file: File) => {
        const attachmentId = actions.addAttachment(file);
        try {
            const result = await uploadToCloudinary(file, (progress) => {
                actions.updateAttachmentProgress(attachmentId, progress);
            });
            actions.setAttachmentUploaded(attachmentId, result.url);
        } catch (error) {
            console.error('Failed to upload file:', error);
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            actions.setAttachmentError(attachmentId, errorMessage);
            toast.error(`Failed to upload ${file.name}`);
            setTimeout(() => {
                actions.removeAttachment(attachmentId);
            }, 3000);
        }
    }, [actions]);

    const handleInlineImageSelect = useCallback(async (file: File) => {
        const attachmentId = actions.addAttachment(file);
        try {
            toast.info(`Uploading image ${file.name}...`);
            const result = await uploadToCloudinary(file, (progress) => {
                actions.updateAttachmentProgress(attachmentId, progress);
            });
            actions.setAttachmentUploaded(attachmentId, result.url);
            setInlineImageId(attachmentId);
            toast.success('Image ready to share inline');
        } catch (error) {
            console.error('Failed to upload inline image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            actions.setAttachmentError(attachmentId, errorMessage);
            toast.error(`Failed to upload ${file.name}`);
            setTimeout(() => actions.removeAttachment(attachmentId), 3000);
        }
    }, [actions]);

    useEffect(() => {
        if (inlineImageId) {
            const exists = state.attachments.some(a => a.id === inlineImageId);
            if (!exists) setInlineImageId(null);
        }
    }, [state.attachments, inlineImageId]);

    const handleSend = useCallback(async () => {
        if (!hasContent || disabled || !chatId || !user) return;

        const stillUploading = state.attachments.some(
            a => a.uploadStatus === 'uploading' || a.uploadStatus === 'idle'
        );

        if (stillUploading) {
            toast.error('Please wait for attachments to finish uploading');
            return;
        }

        const failedUploads = state.attachments.filter(a => a.uploadStatus === 'error');
        if (failedUploads.length > 0) {
            toast.error('Some attachments failed to upload. Please remove them and try again.');
            return;
        }

        setIsLoading(true);

        try {
            const messageData: SendMessageData = {
                text: state.text.trim() || undefined,
                attachments: state.attachments.length > 0 ? state.attachments : undefined,
                voiceUrl: voiceRecording.recording?.url,
                replyTo: state.replyTo?.id,
            };

            const uploadedWithId = state.attachments
                .filter(a => a.cloudinaryUrl && a.uploadStatus === 'success')
                .map(a => ({ id: a.id, url: a.cloudinaryUrl!, type: a.type, name: a.name }));

            let image_url: string | null = null;
            let attachmentsToSend: Array<{ url: string; type: string; name?: string }> = [];

            if (inlineImageId) {
                const inline = uploadedWithId.find(u => u.id === inlineImageId && u.type === 'image');
                if (inline) {
                    image_url = inline.url;
                    attachmentsToSend = uploadedWithId
                        .filter(u => u.id !== inlineImageId)
                        .map(u => ({ url: u.url, type: u.type, name: u.name }));
                } else {
                    attachmentsToSend = uploadedWithId.map(u => ({ url: u.url, type: u.type, name: u.name }));
                    image_url = null;
                }
            } else {
                attachmentsToSend = uploadedWithId.map(u => ({ url: u.url, type: u.type, name: u.name }));
                image_url = null;
            }

            const voice_url = messageData.voiceUrl || null;

            await sendMessage({
                id: '',
                chat_id: chatId,
                sender_id: user.id,
                text: messageData.text || null,
                image_url: image_url,
                voice_url: voice_url,
                reply_to: messageData.replyTo || null,
                seen_by: [],
                edited: false,
                deleted: false,
                created_at: new Date().toISOString(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                attachments: attachmentsToSend as any,
            });

            if (onSend) {
                onSend(messageData);
            }

            actions.clearInput();
            voiceRecording.clearRecording();
            setInlineImageId(null);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [
        hasContent,
        disabled,
        chatId,
        user,
        state.text,
        state.attachments,
        state.replyTo,
        voiceRecording,
        sendMessage,
        onSend,
        actions,
        inlineImageId,
    ]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleStartRecording = useCallback(async () => {
        if (state.text || state.attachments.length > 0) {
            toast.error('Please send your current message before recording voice.');
            return;
        }
        await voiceRecording.startRecording();
    }, [state.text, state.attachments.length, voiceRecording]);

    return (
        <div
            ref={inputContainerRef}
            className={cn(
                "w-full px-2 md:px-4 pb-2 md:pb-4 pt-2 transition-all duration-300",
                "bg-background border-t"
            )}
        >            <ReplyPreview
                replyTo={state.replyTo}
                onCancel={() => actions.setReplyTo(null)}
            />

            <AttachmentPreview
                attachments={state.attachments}
                onRemove={actions.removeAttachment}
            />

            <VoiceRecordingPreview
                recording={voiceRecording.recording}
                onRemove={voiceRecording.clearRecording}
            />

            {/* Main Input Area */}
            <div
                className={cn(
                    "flex items-end gap-2 transition-all duration-300",
                    disabled && "opacity-50 pointer-events-none"
                )}
            >
                {/* Emoji Button - Always visible on left */}


                {/* Text Input Container */}
                <div
                    className={cn(
                        "flex-1 flex items-end gap-1",
                        "bg-muted/30 rounded-3xl",
                        "border border-border/50",
                        "transition-all duration-300",
                        state.isFocused && "border-primary/30 bg-muted/50 shadow-sm"
                    )}
                >

                    <div className={cn(
                        "transition-all duration-300",
                        voiceRecording.isRecording && "opacity-0 scale-0"
                    )}>
                        <EmojiButton
                            onEmojiSelect={handleEmojiSelect}
                            disabled={disabled || voiceRecording.isRecording}
                            isOpen={state.showEmojiPicker}
                            onOpenChange={(open) => {
                                if (open) actions.toggleEmojiPicker();
                                else if (state.showEmojiPicker) actions.toggleEmojiPicker();
                            }}
                        />
                    </div>
                    <TextInput
                        value={state.text}
                        onChange={actions.setText}
                        onFocus={() => actions.setFocus(true)}
                        onBlur={() => actions.setFocus(false)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled || voiceRecording.isRecording}
                        maxLength={maxLength}
                        isFocused={state.isFocused}
                    />

                    {/* Right side buttons - Hidden when typing */}
                    <div className={cn(
                        "flex items-center gap-1 transition-all duration-300",
                        isTyping && "opacity-0 scale-0 w-0"
                    )}>
                        {/* Inline Image Button */}
                        <input
                            ref={inlineImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleInlineImageSelect(file);
                                    e.target.value = '';
                                }
                            }}
                            className="hidden"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => inlineImageInputRef.current?.click()}
                            disabled={disabled || voiceRecording.isRecording}
                            className="h-8 w-8 rounded-full"
                        >
                            <IconPhoto className="h-5 w-5" />
                        </Button>

                        {/* Attachment Button */}
                        <AttachmentButton
                            onFileSelect={handleFileSelect}
                            disabled={disabled || voiceRecording.isRecording}
                            isOpen={state.showAttachmentMenu}
                            onOpenChange={(open) => {
                                if (open) actions.toggleAttachmentMenu();
                                else if (state.showAttachmentMenu) actions.toggleAttachmentMenu();
                            }}
                        />
                    </div>
                </div>

                {/* Send or Voice Button - WhatsApp style */}
                <div className="transition-all duration-300">
                    {hasContent ? (
                        <Button
                            onClick={handleSend}
                            disabled={disabled || !hasContent || isLoading}
                            className={cn(
                                " rounded-full transition-all duration-300",
                                "bg-primary hover:bg-primary/90",
                                "shadow-lg hover:shadow-xl",
                                "rotate-0 hover:rotate-[-15deg]"
                            )}
                        >
                            <IconSend className="h-8 w-8" />
                        </Button>
                    ) : (
                        <VoiceRecordButton
                            isRecording={voiceRecording.isRecording}
                            onStartRecording={handleStartRecording}
                            onStopRecording={voiceRecording.stopRecording}
                            onCancelRecording={voiceRecording.cancelRecording}
                            disabled={disabled}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputBox;
