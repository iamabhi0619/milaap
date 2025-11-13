"use client"

import ChatList from "@/components/ChatList"
import MessageCanvas from "@/components/MessageCanvas"
import ChatTopBar from "@/components/Topbar/chat-top-bar"
import Topbar from "@/components/Topbar/Topbar"
import { useMessageStore } from "@/stores/message"
import { useEffect } from "react"



const Chats = () => {
    const { clearMessages, unselectChat, selectedChatId } = useMessageStore();

    useEffect(() => {
        return () => {
            clearMessages();
            unselectChat();
        };
    }, [])



    return (
        <div className="w-full overflow-hidden h-full flex flex-col">
            {/* Mobile Layout */}
            <div className="flex flex-col h-full md:hidden" id="for-mobile">
                {selectedChatId ? (<ChatTopBar />) : (<Topbar />)}
                <div className="flex-1 overflow-hidden">
                    {selectedChatId ? (<MessageCanvas />) : (<ChatList />)}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex h-full" id="for-desktop">
                <div className="flex flex-col h-full w-full">
                    <Topbar />
                    <div className="flex flex-1 overflow-hidden">
                        <div className="w-80 border-r h-full overflow-hidden">
                            <ChatList />
                        </div>
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            <ChatTopBar />
                            <div className="flex-1 overflow-hidden">
                                <MessageCanvas />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chats