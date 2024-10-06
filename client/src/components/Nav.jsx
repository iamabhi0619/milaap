import React, { useContext, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import userContext from "../context/userContext";
import { FaBell, FaXmark } from "react-icons/fa6";

export const Nav = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { user, setUser, notifications, setNotifications } = useContext(userContext);
  const toggleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-500 relative">
      <div className="flex items-center gap-2">
        <img src="asset/MILAAP_logo.png" alt="Logo" className="h-16" />
        <div className="text-center">
          <p className="md:text-3xl font-bold tracking-widest">
            <span className="text-[#1cba99]">MIL</span>
            <span className="text-[#00a0e9]">AAP</span>
          </p>
          <p className="text-xs font-bold tracking-widest dark:text-white">
            PLACE FOR ALL
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div
          className="md:mr-3 text-xl md:text-3xl text-blue-light relative flex notification hover:cursor-pointer"
          onClick={toggleNotification}
        >
          <FaBell className="mr-2 md:mr-3 mt-2 bell" />
          <div className="absolute top-0 right-0 bg-red-500 text-white h-4 w-4 md:h-6 md:w-6 rounded-full flex justify-center items-center">
            <p className="text-sm font-semibold">{notifications.length}</p>
          </div>
        </div>

        {showNotification && (
          <div className="absolute right-0 top-14 px-2 w-80 bg-blue-lightDark shadow-lg rounded-md z-10 py-2">
            <div className="flex flex-row-reverse" >
              <FaXmark className="text-xl font-bold text-blue-light  hover:cursor-pointer" onClick={()=>{setNotifications([]);localStorage.setItem("notifications", JSON.stringify([]));setShowNotification(false)}}/>
            </div>
            <div className="absolute right-4 top-[-8px] w-0 h-0 border-l-8 border-r-8 border-b-8 border-b-blue-950 border-l-transparent border-r-transparent"></div>
            {notifications.map((notification, index) => (
              <div key={index} className="flex gap-3 items-center py-2 px-1 hover:border-b hover:border-b-white transition-all">
                <div>
                  <img
                    src="https://avatar.iran.liara.run/public/boy?username=Abhishek"
                    alt=""
                    className="h-12 w-12"
                  />
                </div>
                <div className="block md:hidden text-white">
                  <p className="font-semibold text-lg">{notification.name}</p>
                  <p className="text-sm">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border border-transparent hover:cursor-pointer hover:scale-105 dark:hover:border-blue-light rounded-2xl p-1 transition-all duration-75">
          <img
            src={`https://avatar.iran.liara.run/public/boy?username=${user.name}`}
            alt="User Avatar"
            className="rounded-full border-2 dark:border-blue-light h-10 p-0.5"
          />
          <p className="text-lg font-semibold tracking-wide dark:text-blue-light hidden md:block">
            {user.name}
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              localStorage.clear();
              setUser(null);
            }}
            className="flex items-center gap-3 px-2 md:px-4 py-2 font-semibold rounded-full text-xl hover:scale-125 md:mr-4 transition-all dark:text-blue-light"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
};
