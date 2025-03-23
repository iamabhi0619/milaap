"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // Zustand store
import { Message } from "@/types";
import moment from "moment";
import { useChatStore } from "@/stores/chatStore";

type Props = {
    chatId: string;
};

const MessageList = ({ chatId }: Props) => {
    const [loading, setLoading] = useState(false);
    const { messages, addMessage, updateMessage, fetchOlderMessages } =
        useChatStore((state) => ({
            messages: state.messages,
            addMessage: state.addMessage,
            updateMessage: state.updateMessage,
            fetchOlderMessages: state.fetchOlderMessages,
        }));

    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    // Lazy Load Messages on Scroll Up
    useEffect(() => {
        if (!lastMessageRef.current) return;

        observer.current = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setLoading(true);
                    await fetchOlderMessages(chatId);
                    setLoading(false);
                }
            },
            { threshold: 0.5 }
        );

        observer.current.observe(lastMessageRef.current);

        return () => observer.current?.disconnect();
    }, [chatId, loading, fetchOlderMessages]);

    // Listen for New & Updated Messages in Supabase
    useEffect(() => {
        const channel = supabase
            .channel(`messages:${chatId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
                (payload) => {
                    const msg: Message = payload.new;
                    if (payload.eventType === "INSERT") addMessage(msg);
                    if (payload.eventType === "UPDATE") updateMessage(msg);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId, addMessage, updateMessage]);

    return (
        <div className="h-full overflow-y-auto p-4 flex flex-col-reverse">
            {loading && <p className="text-center text-gray-500">Loading messages...</p>}

            {messages.map((msg, index) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className={`flex items-start gap-2 ${msg.isOwn ? "justify-end" : "justify-start"
                        }`}
                >
                    <div
                        className={`p-3 rounded-lg text-white ${msg.isOwn ? "bg-blue-500" : "bg-gray-700"
                            }`}
                    >
                        <p>{msg.text}</p>
                        <small className="text-xs text-gray-300">
                            {moment(msg.created_at).format("hh:mm A")}
                            {msg.isEdited && <span className="ml-1 text-yellow-400">(edited)</span>}
                        </small>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default MessageList;
