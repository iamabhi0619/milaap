import { IconArrowLeft } from '@tabler/icons-react'
import React from 'react'
import ChatTopBarMenu from './chat-top-bar-menu'
import { useMessageStore } from '@/stores/message'
import { cn } from '@/lib/utils'

function ChatTopBar() {
    const { unselectChat } = useMessageStore();
    return (
        <div className={cn(
            'w-full flex items-center justify-between px-2 py-2 shrink-0',
            'border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'
        )}>
            {/* Top bar content goes here */}
            <div>
                <IconArrowLeft className='size-full' onClick={() => unselectChat()} />

            </div>
            <div>
                <ChatTopBarMenu />
            </div>
        </div>
    )
}

export default ChatTopBar