'use client';

import React, { useState } from 'react';
import { Plus, Search, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChatAddDialog } from './ChatAddDialog';

interface ChatListHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onNewChat?: () => void;
}

export function ChatListHeader({ searchQuery, onSearchChange, onNewChat }: ChatListHeaderProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [chatType, setChatType] = useState<'dm' | 'group' | null>(null);

    const handleChatTypeSelect = (type: 'dm' | 'group') => {
        setChatType(type);
        setDialogOpen(true);
        setIsPopoverOpen(false);
    };

    console.log(onNewChat);

    return (
        <>
            <div className="flex flex-col gap-3 p-4 border-b  backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Chats</h2>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full h-10 w-10 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-56 p-2"
                            align="end"
                            sideOffset={8}
                        >
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleChatTypeSelect('dm')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
                                >
                                    <MessageCircle className="h-5 w-5 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">New Chat</span>
                                        <span className="text-xs text-muted-foreground">
                                            Start a direct message
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleChatTypeSelect('group')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
                                >
                                    <Users className="h-5 w-5 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Group Chat</span>
                                        <span className="text-xs text-muted-foreground">
                                            Create a new group
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Chats search..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 h-10 bg-background/50"
                    />
                </div>
            </div>

            <ChatAddDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                chatType={chatType}
            />
        </>
    );
}
