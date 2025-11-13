import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { IconDotsVertical } from '@tabler/icons-react'

const ChatTopBarMenu = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size={'icon'} className='cursor-pointer'>
                    <IconDotsVertical />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">
                            Some of the option commin soon.
                        </p>
                    </div>
                    <div className="grid gap-2">




                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ChatTopBarMenu   