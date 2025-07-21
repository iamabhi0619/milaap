"use client"
import ChatNavigation from '@/components/ChatList'
import MessageCanvas from '@/components/MessageCanvas'
// import { useRouter } from "next/navigation";
// import { useUserStore } from '@/stores/userStoretemp';


const Chats = () => {
    // const router = useRouter();
    // const { isAuthenticated } = useUserStore();

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         router.push("/");
    //     }
    // }, [isAuthenticated, router]);


    return (
        <div className='flex w-full h-screen overflow-y-hidden'>
            <ChatNavigation />
            <div className='hidden md:block w-full'>
                <MessageCanvas />
            </div>
        </div>
    )
}

export default Chats