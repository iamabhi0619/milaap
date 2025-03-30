import { useChatStore } from '@/stores/chatStore';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

type Props = {
    setView: () => void;
};
const UserCanvas = ({ setView }: Props) => {
    const { chats, chatId } = useChatStore();
    const chat = chats.find((c) => c.id === chatId);

    if (!chat) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='w-full max-w-xs bg-white rounded-l-3xl p-4 shadow-md flex flex-col gap-12'>
            <div className='flex items-end justify-end w-full'>
                <X className='cursor-pointer text-navy hover:text-navyLightest' onClick={setView} />
            </div>
            <div className='flex items-center gap-3 flex-col justify-center'>
                <Image
                    src={chat.avatar || 'https://avatar.iran.liara.run/public'}
                    alt="User Avatar"
                    width={100}
                    height={100}
                    className='h-32 w-32 rounded-full object-cover'
                />
                <div>
                    <h2 className='font-bold text-navy text-lg'>{chat.chat_name}</h2>
                </div>
            </div>
            <button className='bg-red-400 text-lg py-1 rounded-3xl hover:bg-red-500 cursor-pointer font-semibold text-navy'>
                Block
            </button>
        </motion.div>
    );
};


export default UserCanvas;