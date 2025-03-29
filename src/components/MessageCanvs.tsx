"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useChatStore } from "@/stores/chatStore";
import TopBar from "./chat/TopBar";
import InputSection from "./chat/InputSection";
import UserCanvs from "./UserCanvs";
import { Message } from "@/types/types";
import { useMessageStore } from "@/stores/messageStore";

// Define types for Chat and Message
type Chat = {
    id: string;
    is_group_chat?: boolean;
    chat_name?: string;
    avatar?: string;
};

interface MessageCanvasProps {
    chatId: string;
}

const MessageCanvas = ({ chatId : string }: MessageCanvasProps) => {
    const [loading, setLoading] = useState(false);
    const [isview, setIsview] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const params = useParams(); // Get dynamic chatId from URL
    const chatIdFromUrl = params.chatId as string; // Ensure it's a string

    const setView = () => {
        setIsview(!isview);
    };

    const {
        chatId,
        chats,
        changeChat,
    } = useChatStore();

    const { handleMessageUpdates, messages } = useMessageStore();
    const { user } = useUserStore();

    const selectedChat = useMemo(() => chats.find((chat: Chat) => chat.id === chatId), [chats, chatId]);
    const isGroupChat = selectedChat?.is_group_chat || false;
    const chatName = selectedChat?.chat_name || "Chat";

    // Update chatId in the store when URL changes
    useEffect(() => {
        if (chatIdFromUrl && chatIdFromUrl !== chatId) {
            changeChat(chatIdFromUrl);
        }
    }, [chatIdFromUrl, chatId, changeChat]);

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = handleMessageUpdates();
        return () => unsubscribe?.();
    }, [chatId, handleMessageUpdates]);

    // Lazy load messages when scrolling to top
    const fetchMoreMessages = useCallback(async () => {
        if (!chatId || loading) return;
        setLoading(true);
        try {
            const previousScrollHeight = chatContainerRef.current?.scrollHeight || 0;
            await changeChat(chatId);
            requestAnimationFrame(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - previousScrollHeight;
                }
            });
        } catch (error) {
            console.error("Error fetching more messages:", error);
        }
        setLoading(false);
    }, [chatId, loading, changeChat]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        requestAnimationFrame(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        });
    }, [messages]);

    return (
        <div className="w-full h-screen flex">
            <div className="h-screen flex flex-col bg-gray-100 w-full">
                {/* Chat Header */}
                <TopBar setView={setView} chatName={chatName} avatar={selectedChat?.avatar || ""} isGroupChat={isGroupChat} isTyping={false} />
                {/* Messages Container */}
                <div
                    className="flex-1 p-4 overflow-y-auto space-y-4"
                    ref={chatContainerRef}
                    onScroll={(e) => {
                        if (e.currentTarget.scrollTop === 0) fetchMoreMessages();
                    }}
                >
                    {messages.length === 0 && (
                        <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                    )}

                    {messages.map((msg: Message) => {
                        const isUserMessage = user?.id && msg.sender_id === user.id;
                        console.log(msg);
                        const chat = chats.find((c: Chat) => c.id === chatId);
                        console.log(chat);
                        return (
                            <div key={msg.id} className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs p-3 rounded-lg ${isUserMessage ? "bg-blue-500 text-white" : "bg-white text-gray-900"} shadow`}>
                                    {!isUserMessage && <span className="block text-xs text-gray-500"></span>}
                                    {msg.text && <p>{msg.text}</p>}
                                    {msg.voice_url && <audio controls src={msg.voice_url} className="w-40 h-10"></audio>}
                                    <span className="text-xs text-gray-500 mt-1 text-right flex items-center gap-1">
                                        {/* {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : "Invalid date"} {isUserMessage && statusIcon} */}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {loading && <p className="text-center text-gray-500">Loading more...</p>}
                </div>

                {/* Input Field */}
                <InputSection />
            </div>
            {isview && <UserCanvs setView={setView} />}
        </div>
    );
};

export default MessageCanvas;
