"use client";
import ChatList from "@/components/ChatList";
// import ChatList from "@/components/ChatList";
import MessageCanvas from "@/components/MessageCanvs";
import { useParams } from "next/navigation";

const ChatPage = () => {
    const params = useParams(); // Get dynamic chatId from URL
    const chatId = params.chatId as string; // Ensure it's a string

    return (
        <div className="flex w-full h-screen overflow-y-hidden">
            <div className="hidden md:block">
                <ChatList />
            </div>
            <div className="hidden md:block w-full">
                <MessageCanvas chatId={chatId} /> {/* Pass chatId */}
            </div>
        </div>
    );
};

export default ChatPage;
