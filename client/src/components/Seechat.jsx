import React, { useContext } from "react";
import userContext from "../context/userContext";

function Seechat() {
  const { chats, setSelectedChat, user } = useContext(userContext);
  const truncateText = (text, maxLength = 30) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="mt-5 mx-3">
      {chats.length === 0 ? (
        <p>No chats to show</p>
      ) : (
        chats.map((chat) => {
          // Identify the other user in direct chat (if not a group chat)
          const otherUser = chat.isGroupChat
            ? null
            : chat.users.find((u) => u._id !== user._id);
          const avatarSrc = chat.isGroupChat
            ? "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png"
            : `https://avatar.iran.liara.run/public/boy?username=${otherUser.username}`;

          return (
            <div
              key={chat._id}
              className="flex items-center gap-3 mb-3 p-1 cursor-pointer rounded-xl hover:bg-navyBlue-dark"
              onClick={() => setSelectedChat(chat)}
            >
              <div className="w-16 h-16 border-2 rounded-full p-0.5 border-blue-light">
                <img
                  src={avatarSrc}
                  alt={chat.isGroupChat ? "Group Avatar" : otherUser.username}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-blue-light">
                  {chat.isGroupChat ? chat.chatName : otherUser.name}
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-200 truncate w-full">
                  {truncateText(chat.latestMessage?.content || "No messages yet")}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Seechat;
