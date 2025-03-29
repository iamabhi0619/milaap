"use client"
import ChatNavigation from '@/components/ChatList'
import MessageCanvas from '@/components/MessageCanvs'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import { useUserStore } from '@/stores/userStore';


const Chats = () => {
    const router = useRouter();
    const { isAuthenticated } = useUserStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);


    return (
        <div className='flex w-full h-screen overflow-y-hidden'>
            <ChatNavigation />
            <div className='hidden md:block w-full'>
                <MessageCanvas chatId={""}/>
            </div>
        </div>
    )
}

export default Chats