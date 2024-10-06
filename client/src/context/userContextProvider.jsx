import React, { useState, useEffect } from "react";
import userContext from "./userContext";
import io from "socket.io-client";

let socket;

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );

  useEffect(() => {
    const fetchUserChat = async () => {
      try {
        const response = await fetch(`/api/chat/fetch`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch chat data");
        }

        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError("Failed to load chats");
      }
    };

    const fetchUserData = async () => {
      if (token) {
        setLoading(true);
        try {
          const response = await fetch(`/api/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.data);
            await fetchUserChat();
            socket = io(
              `${window.location.protocol}//${window.location.hostname}${
                window.location.port ? ":" + window.location.port : ""
              }`
            );
            socket.emit("setup", userData.data);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          handleLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    socket && socket.disconnect();
  };
  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        loading,
        error,
        handleLogout,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
