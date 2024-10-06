import React, { useContext, useEffect, useRef, useState } from "react";
import SandButtom from "./SendButtom";
import userContext from "../context/userContext";
import { toast } from "react-toastify";
import NoChatScreen from "./NoChatScreen";
import Loader from "./Loader";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { RiEmojiStickerFill } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa6";

let socket, selectedChatCompare;

function Chat() {
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const {
    token,
    selectedChat,
    user,
    setNotifications,
    setChats,
    setSelectedChat,
  } = useContext(userContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? ":" + window.location.port : ""
      }`
    );
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("message recieved", (newMessageRecieved) => {
      if (
        selectedChatCompare &&
        selectedChatCompare._id === newMessageRecieved.chat._id
      ) {
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const chatIndex = updatedChats.findIndex(
            (chat) => chat._id === newMessageRecieved.chat._id
          );

          if (chatIndex > -1) {
            const [updatedChat] = updatedChats.splice(chatIndex, 1);
            updatedChat.latestMessage = newMessageRecieved;
            updatedChats.unshift(updatedChat);
          }
          return updatedChats;
        });
        if (!messages.some(message => message._id === newMessageRecieved._id)) {
          setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
        }
      } else {
        const nnotification = {
          name: newMessageRecieved.sender.name,
          message: newMessageRecieved.content,
        };
        toast.info(`New message Recived from ${nnotification.name}\n`);
        setNotifications((prevNotifications) => {
          const updatedNotifications = [nnotification, ...prevNotifications];
          localStorage.setItem(
            "notifications",
            JSON.stringify(updatedNotifications)
          );
          return updatedNotifications;
        });
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const chatIndex = updatedChats.findIndex(
            (chat) => chat._id === newMessageRecieved.chat._id
          );

          if (chatIndex > -1) {
            const [updatedChat] = updatedChats.splice(chatIndex, 1);
            updatedChat.latestMessage = newMessageRecieved;
            updatedChats.unshift(updatedChat);
          }
          return updatedChats;
        });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [user, selectedChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/message/${selectedChat._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch messages");
          }

          const data = await response.json();
          setMessages(data);
          socket.emit("join chat", selectedChat._id); // Join the selected chat room
          selectedChatCompare = selectedChat; // Set the current selected chat
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMessages();
  }, [selectedChat, token]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let chatName;
  if (selectedChat) {
    if (selectedChat.isGroupChat) {
      chatName = selectedChat.chatName;
    } else {
      const otherUser = selectedChat.users.find((u) => u._id !== user._id);
      chatName = otherUser ? otherUser.name : "Unknown";
    }
  } else {
    chatName = `Welcome ${user.name}..!!`;
  }

  // Handle sending a message
  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const payload = {
        content,
        chatId: selectedChat._id,
      };
      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const newMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(
          (chat) => chat._id === newMessage.chat._id
        );
        if (chatIndex > -1) {
          const [updatedChat] = updatedChats.splice(chatIndex, 1);
          updatedChat.latestMessage = newMessage;
          updatedChats.unshift(updatedChat);
        }
        return updatedChats;
      });
      socket.emit("new message", newMessage);
      setContent("");
    } catch (error) {
      toast.warn("Error sending the message");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessageSend(e);
    }
  };

  return (
    <div className="rounded-lg w-full h-full pb-2">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b dark:border-zinc-700">
          <div
            className="md:hidden font-bold text-blue-light hover:cursor-pointer hover:scale-125 transition-all duration-300"
            onClick={() => {
              setSelectedChat(null);
            }}
          >
            <FaArrowLeft size={25} />
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-semibold dark:text-blue-light text-2xl">
              {chatName}
            </h2>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col p-4 overflow-y-scroll space-y-2 grow font-semibold scroll-smooth scrollbar-hide">
          {selectedChat ? (
            messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`relative max-w-md py-1 px-5 rounded-3xl ${
                    message.sender._id === user._id
                      ? "self-end bg-navyBlue-normal text-white rounded-br-none"
                      : "self-start bg-gray-normal text-navyBlue-normal rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              ))
            ) : isLoading ? (
              <Loader />
            ) : (
              <div className="flex items-center justify-center my-auto text-2xl text-blue-light">
                <p>No messages yet..!!</p>
              </div>
            )
          ) : (
            <NoChatScreen />
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        {selectedChat && (
          <div className="dark:border-zinc-700">
            <div className="relative">
              <EmojiPicker
                open={emoji}
                height={450}
                width={350}
                size={32}
                onEmojiClick={(e) => {
                  setContent(content + e.emoji);
                }}
              />
            </div>
            <div className="flex gap-3 items-center border-b-2 pb-2 border-blue-light">
              <RiEmojiStickerFill
                className="text-2xl text-blue-light cursor-pointer"
                onClick={() => {
                  setEmoji(!emoji);
                }}
              />

              <input
                ref={inputRef}
                placeholder="Type your message..."
                className="flex-1 placeholder-gray-300 text-white bg-transparent focus:outline-none border-blue-light font-semibold"
                id="chatInput"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setEmoji(false);
                }}
                autoFocus
              />
              {/* <FaPaperclip className="text-2xl text-blue-light mr-2 cursor-pointer"/> */}
              <button onClick={handleMessageSend}>
                <SandButtom />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
