import React, { useState, useContext, useEffect } from "react";
import { BiSolidMessageAdd } from "react-icons/bi";
import { MdGroupAdd } from "react-icons/md";
import CreateGroupChat from "./CreateGroupChat";
import userContext from "../context/userContext";
import Seechat from "./Seechat";
import Footer from "./Footer";

function SideBar() {
  const [search, setSearch] = useState([]);
  const [addGroup, setAddgroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchbar, setSearchbar] = useState(false);
  const { token, setChats } = useContext(userContext);

  const toggle = () => {
    setAddgroup(!addGroup);
  };

  const creatChat = async (id) => {
    try {
      setSearch([]);
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to start chat");
      }
      const data = await response.json();
      setChats((prevChats) => [data, ...prevChats]);
      console.log(data);
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setSearchbar(!searchbar);
    }
  };

  const handleUserSearch = async (input) => {
    if (input.length > 0) {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/search?search=${input}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();
        setSearch(data.users);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearch([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleUserSearch(searchInput);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  return (
    <div className="py-3 h-full rounded-lg flex flex-col">
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between text-3xl dark:text-blue-light">
          <div>
            {!searchbar ? (
              <p className="font-semibold font-normal">CHATS</p>
            ) : (
              <input
                className="w-full text-xl border-b-2 bg-transparent border-transparent focus:outline-none dark:focus:border-blue-light dark:placeholder-gray-300 font-semibold tracking-wider transition-all"
                placeholder="Search..."
                type="text"
                required
                onChange={(e) => setSearchInput(e.target.value)}
              />
            )}
          </div>
          <div className="flex gap-3 justify-between">
            {!searchbar && (
              <BiSolidMessageAdd
                onClick={() => setSearchbar(!searchbar)}
                className="hover:text-blue-500 transition-colors duration-300 cursor-pointer"
              />
            )}
            <MdGroupAdd
              onClick={toggle}
              className="hover:text-blue-500 transition-colors duration-300 cursor-pointer"
            />
          </div>
        </div>
        <div className="">
          {search.length > 0 && (
            <div className="absolute bg-navyBlue-dark py-3 px-2 w-full text-xl mt-2 rounded-lg text-white font-semibold tracking-wide">
              {search.map((searchedUser) => (
                <div
                  key={searchedUser._id}
                  className="flex border-2 hover:border-gray-700 m-1 hover:bg-navyBlue-light p-1 gap-2 cursor-pointer transition-all duration-300 hover:rounded-xl"
                  onClick={() => creatChat(searchedUser._id)}
                >
                  <img
                    src={`https://avatar.iran.liara.run/public/boy?username=${searchedUser.username}`}
                    alt={searchedUser.username}
                    className="h-12"
                  />
                  <div>
                    <p className="text-lg">{searchedUser.name}</p>
                    <p className="text-sm">{searchedUser.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        <Seechat />
      </div>
      <Footer />
      {addGroup && <CreateGroupChat toggle={toggle} />}
    </div>
  );
}

export default SideBar;
