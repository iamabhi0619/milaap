'use client'
import { FC, ReactNode } from "react"

type ChatsLayoutProps = {
    children: ReactNode;
}

const ChatsLayout: FC<ChatsLayoutProps> = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}

export default ChatsLayout