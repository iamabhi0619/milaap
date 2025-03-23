import ChatNavigation from '@/components/ChatList'
import MessageCanvas from '@/components/MessageCanvs'
import React from 'react'

const Chats = () => {
    return (
        <div className='flex w-full h-screen overflow-y-hidden'>
            <ChatNavigation />
            <MessageCanvas />
        </div>
    )
}

export default Chats