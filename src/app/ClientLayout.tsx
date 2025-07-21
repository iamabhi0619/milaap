'use client';

import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function ClientLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { fetchUser } = useUserStore();

    useEffect(() => {
        console.log("Log here..")
        fetchUser();
    }, [fetchUser]);



    return <>{children}</>;
}
