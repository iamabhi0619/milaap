"use client";
import { useMessageStore } from "@/stores/message";
import { use, useEffect } from "react";
import ChatList from "@/components/ChatList";
import MessageCanvas from "@/components/MessageCanvas";
import Topbar from "@/components/Topbar/Topbar";

const ChatPage = ({ params }: { params: Promise<{ chatId: string }> }) => {
    const { chatId } = use(params);
    const { selectChat } = useMessageStore();

    useEffect(() => {
        if (chatId) {
            selectChat(chatId); // assuming false for isGroup, adjust as needed
        }
    }, [chatId]);

    return (
        <div className="w-full h-dvh overflow-y-hidden">
            <Topbar />
            <div className="flex">
                <div className="hidden md:block w-full max-w-sm">
                    <ChatList />
                </div>
                <div className="block w-full">
                    <MessageCanvas />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
