"use client";
import ChatList from "@/components/ChatList";
import MessageCanvas from "@/components/MessageCanvas";
// import ChatList from "@/components/ChatList";

const ChatPage = () => {

    return (
        <div className="flex w-full h-screen overflow-y-hidden">
            <div className="hidden md:block">
                <ChatList />
            </div>
            <div className="hidden md:block w-full">
                <MessageCanvas />
            </div>
        </div>
    );
};

export default ChatPage;
