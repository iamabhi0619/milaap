"use client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import { Inter } from "next/font/google";
import SearchBar from "./SearchBar";

const inter = Inter({ subsets: ["latin"] });

export default function ChatList() {
  const { chats, fetchChats, changeChat } = useChatStore();
  const { user } = useUserStore();
  const [filter, setFilter] = useState<"all" | "personal" | "group">("all");

  console.log(chats);



  const handalGroup = () => {
    console.log("Groupcreate");

  }

  useEffect(() => {
    console.log("Hellow");

    if (user && user.name) {
      fetchChats({ ...user, name: user.name as string });
    }
  }, [user, fetchChats]);


  // const filteredChats = chats.filter(
  //   (chat) =>
  //     (filter === "all" || chat.type === filter) &&
  //     !chat.blocked.includes(user?.id ?? "") // Don't show chats where the current user is blocked
  // );

  return (
    <div className="flex flex-col h-screen max-w-sm w-full overflow-y-hidden">
      <div className="bg-navyLightest px-4 py-2 space-y-6 pb-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={user?.avatar || "https://avatar.iran.liara.run/public"}
              alt="User Avatar"
              width={100}
              height={100}
              className="h-16 w-16 rounded-full border-2 border-white"
            />
            <div className="-space-y-1">
              <p className={`text-slateLight ${inter.className}`}>Good Morning</p>
              <p className={`text-xl font-semibold text-white ${inter.className}`}>
                {user?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-4xl font-semibold text-white tracking-wider ${inter.className}`}>
            Chat
          </p>
          <SearchBar onCreateGroup={handalGroup} />
        </div>
      </div>

      <div className="flex justify-between px-6 py-4 bg-navy -mt-10 pb-14 text-white rounded-t-4xl text-xl font-semibold">
        <button
          className={`px-5 py-1 rounded-full tracking-wide ${filter === "all" ? "bg-slateLight text-navy" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-5 py-1 rounded-full tracking-wide ${filter === "personal" ? "bg-slateLight text-navy" : ""}`}
          onClick={() => setFilter("personal")}
        >
          Personal
        </button>
        <button
          className={`px-5 py-1 rounded-full tracking-wide ${filter === "group" ? "bg-slateLight text-navy" : ""}`}
          onClick={() => setFilter("group")}
        >
          Group
        </button>
      </div>

      <div className="flex-1 overflow-y-scroll bg-white -mt-10 rounded-t-4xl pt-5 hide-scrollbar">
        {chats.length > 0 ? (
          chats.map((users) => (
            <div
              key={users.id}
              className={`flex items-center gap-4 m-2 p-3 cursor-pointer border-b border-slateLight hover:bg-gray-50"
                }`}
              onClick={() => user && changeChat(users.id)}
            >
              <Image src={users?.avatar || "https://avatar.iran.liara.run/public"} alt={users.chat_name || "Chat Avatar"} width={50} height={50} className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-navy text-lg font-semibold">{users.chat_name}</p>
                  {/* {chat. > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )} */}
                </div>
                {/* <p className="text-navyLight text-sm truncate">{chat.lastMessage}</p> */}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">Start chatting to see your conversations here.</p>
        )}
      </div>
    </div>
  );
}
