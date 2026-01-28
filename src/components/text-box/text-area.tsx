'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconSend } from '@tabler/icons-react';
import EmojiSelector from './emoji-selector';
import { Textarea } from '../ui/textarea';
import AttachmentSelector from './attachment-slector';
import AttachmentPreview from './attachment-preview';
import useMessageBoxStore from './messangingStore';
import useVoiceRecordingStore from './voice-recorder/voiceRecordingStore';
import { cn } from '@/lib/utils';
import { useAutoScroll } from './useAutoScroll';
import VoiceRecorder from './voice-recording';

type TextBoxProps = {
    className?: string;
    chatId?: string;
}

const TextBox = (props: TextBoxProps) => {
    const { text, setText, sendMessage, attachments } = useMessageBoxStore();
    const { isRecording } = useVoiceRecordingStore();
    const hasContent = text?.trim() || (attachments && attachments.length > 0);
    const [isFocused, setIsFocused] = useState(false);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    useAutoScroll({
        isFocused,
        isTyping: (text?.length ?? 0) > 0,
        inputContainerRef
    });

    return (
        <div className='flex flex-col w-full gap-2 px-2'>
            <AttachmentPreview />
            <div className='flex items-end w-full gap-3' ref={inputContainerRef}>
                {isRecording ? (
                    <VoiceRecorder />
                ) : (
                    <>
                        <div className='flex custom-scrollbar items-end flex-1 rounded-2xl border-2 border-border/60 px-4 pt-1 pb-1 h-full bg-linear-to-br from-secondary/60 via-secondary/40 to-secondary/20 dark:from-secondary-dark/60 dark:via-secondary-dark/40 dark:to-secondary-dark/20 backdrop-blur-sm shadow-sm hover:border-primary/40 focus-within:border-primary/60 transition-all duration-300'>
                            <EmojiSelector onSelect={(emoji) => {
                                setText(text + emoji);
                            }} />
                            <Textarea
                                placeholder="Type your message..."
                                value={text}
                                rows={1}
                                onChange={(e) => setText(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && hasContent) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                className="field-sizing-content mb-0.5 hide-scrollbar flex-1 max-h-32 overflow-y-auto text-base w-full resize-none bg-none border-0 focus:ring-0 focus-visible:ring-0 bg-transparent py-1 dark:bg-transparent shadow-none min-h-0 placeholder:text-muted-foreground/60"
                            />
                            <AttachmentSelector
                                multiple={true}
                                maxFiles={5}
                                maxFileSize={50}
                            />
                        </div>
                        {
                            (text?.length ?? 0) > 0 ? (
                                <Button
                                    className={cn(
                                        "mx-0 h-12 w-12 rounded-full group cursor-pointer transition-all duration-300",
                                        "shadow-md hover:shadow-lg active:scale-95",
                                        hasContent
                                            ? "bg-primary hover:bg-primary/90 text-primary-foreground scale-100"
                                            : "scale-95 opacity-60"
                                    )}
                                    variant={hasContent ? 'default' : 'outline'}
                                    onClick={sendMessage}
                                    disabled={!hasContent}
                                >
                                    <IconSend className={cn(
                                        'size-5 transition-all duration-300',
                                        hasContent ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''
                                    )} />
                                </Button>
                            ) : (
                                <VoiceRecorder />
                            )
                        }
                    </>
                )}
            </div>
        </div>
    )
}


export default TextBox;