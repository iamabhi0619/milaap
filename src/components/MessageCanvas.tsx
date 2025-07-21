"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useUserStore } from "@/stores/userStoretemp";
import { useChatStore } from "@/stores/chatStoretemp";
import { useMessageStore } from "@/stores/messageStore";
import TopBar from "./chat/TopBar";
import InputSection from "./chat/InputSection";
import UserCanvas from "./UserCanvas";
import { Message, Chat } from "@/types/types";
import formatMessageTime from "@/lib/dateformat";
const MessageCanvas = () => {
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const chatIdFromUrl = params.chatId as string;
    const {
        chatId,
        chats,
        changeChat
    } = useChatStore();
    const {
        messages,
        fetchMessages,
        handleMessageUpdates,
        markAsRead
    } = useMessageStore();
    const { user } = useUserStore();
    const selectedChat = useMemo(
        () => chats.find((chat: Chat) => chat.id === chatId),
        [chats, chatId]
    );
    const isGroupChat = selectedChat?.is_group_chat || false;
    const chatName = selectedChat?.chat_name || "Chat";
    const toggleView = () => setIsView(!isView);
    const id = chatId || chatIdFromUrl || "null";
    // Set chatId in Zustand when URL changes
    useEffect(() => {
        if (id === "null") return;
        changeChat(id);
        fetchMessages(id);
    }, [chatId, changeChat, fetchMessages, id, markAsRead]);
    // Subscribe to real-time updates
    useEffect(() => {
        if (!chatId) return;
        const unsubscribe = handleMessageUpdates();
        return () => unsubscribe?.();
    }, [chatId, handleMessageUpdates]);
    // Fetch more messages on scroll (Lazy Loading)
    const fetchMoreMessages = useCallback(async () => {
        if (!chatId || loading) return;
        setLoading(true);
        try {
            const previousScrollHeight = chatContainerRef.current?.scrollHeight || 0;
            await fetchMessages(chatId);
            requestAnimationFrame(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop =
                        chatContainerRef.current.scrollHeight - previousScrollHeight;
                }
            });
        } catch (error) {
            console.error("Error fetching more messages:", error);
        }
        setLoading(false);
    }, [chatId, loading, fetchMessages]);
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
                <TopBar
                    setView={toggleView}
                    chatName={chatName}
                    avatar={selectedChat?.avatar || ""}
                    isGroupChat={isGroupChat}
                    isTyping={false}
                />
                {/* Messages Container */}
                <div
                    className="flex-1 p-4 overflow-y-auto space-y-3 pt-12"
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

                        return (
                            <div key={msg.id} className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs p-3 rounded-lg ${isUserMessage ? "bg-navyLight text-white" : "bg-white text-gray-900"} shadow`}>
                                    {msg.text && <ReactMarkdown>{msg.text}</ReactMarkdown>}
                                    {msg.voice_url && <audio controls src={msg.voice_url} className="w-40 h-10"></audio>}
                                    <span className={`text-xs font-semibold tracking-wide text-right flex items-center gap-1 ${isUserMessage ? "justify-end text-slateLight" : "justify-start text-navy/60"}`}>
                                        {formatMessageTime(msg.created_at)}
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

            {isView && <UserCanvas setView={toggleView} />}
        </div>
    );
};

export default MessageCanvas;
