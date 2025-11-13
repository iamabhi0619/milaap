'use client';

import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { fetchUser } = useUserStore();

    useEffect(() => {
        fetchUser();
    }, []);

    // For all other routes, render children
    return <div className="px-2 h-dvh overflow-hidden">
        <div className="flex flex-col justify-between h-full pb-2">
            {/* <p>Client Layout Header</p>
            <p>Client Layout Description</p>
            <p>Client Layout Footer</p> */}
            {children}
        </div>

        {/* {children} */}
    </div>;
}
