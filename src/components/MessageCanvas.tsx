"use client";

import React, { useEffect } from "react";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/userStore";
import { MessageList } from "./message-canvas";
import { Card } from "@/components/ui/card";
import { useChatStore } from "@/stores/chatStore";
import InputBox from "./InputBox";

interface MessageCanvasProps {
    chatId?: string;
    isGroupChat?: boolean;
}

function MessageCanvas({ chatId, isGroupChat = false }: MessageCanvasProps) {
    const { messages, loading, hasMore, loadMessages, selectedChatId } = useMessageStore();
    const { user } = useUserStore();
    const { chats } = useChatStore();
    // const [typingUsers, setTypingUsers] = useState<Array<{ name: string; avatar?: string }>>([]);

    useEffect(() => {
        // if (!chatId || !selectedChatId) return;

        if (!selectedChatId) {
            return;
        }
        // Load initial messages
        if (messages.length === 0) {
            loadMessages(selectedChatId, undefined);
        }
    }, [chatId, selectedChatId]);

    const handleLoadMore = () => {
        if (!chatId || loading || !hasMore) return;
        const oldestMessage = messages[0];
        if (oldestMessage) {
            loadMessages(chatId, oldestMessage.created_at);
        }
    };

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Please log in to view messages</p>
            </div>
        );
    }

    if (!selectedChatId) {
        if (!chats || chats.length === 0) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">No chats available. Start a new chat!</p>
                </div>
            );
        }
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a chat to view messages</p>
            </div>
        );
    }

    return (
        <Card className="flex flex-col border-0 shadow-none h-full p-0 w-full">
            {/* Message List */}
            <MessageList
                messages={messages}
                currentUserId={user.id}
                isGroupChat={isGroupChat}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />

            <InputBox chatId={selectedChatId} />

            {/* Typing Indicator */}
            {/* <AnimatePresence>
                {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
            </AnimatePresence> */}
        </Card>
    );
}

export default MessageCanvas;