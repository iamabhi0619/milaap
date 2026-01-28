import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '../ui/emoji-picker';
import { IconMoodSmile } from '@tabler/icons-react';

type Props = {
    onSelect: (emoji: string) => void;
}

const EmojiSelector = (props: Props) => {
    return (
        <Popover >
            <PopoverTrigger asChild>
                <IconMoodSmile className='cursor-pointer hover:text-primary size-7 pb-0.5' />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <EmojiPicker
                    className="h-96"
                    onEmojiSelect={({ emoji }) => {
                        props.onSelect(emoji);
                    }}
                >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <div className="hidden sm:block">
                        <EmojiPickerFooter />
                    </div>
                </EmojiPicker>
            </PopoverContent>
        </Popover>
    )
}

export default EmojiSelector