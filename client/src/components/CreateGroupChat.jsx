import React, { useContext, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import userContext from "../context/userContext";
import { toast } from "react-toastify";

function CreateGroupChat({ toggle }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState([]);
  const { token, setChats } = useContext(userContext);

  const handleUserSearch = async (e) => {
    const input = e.target.value;
    if (input.length > 0) {
      try {
        const response = await fetch(
          `/api/user/search?search=${input}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();

        // Filter out already added members from search results
        const filteredUsers = data.users.filter(
          (user) => !members.some((member) => member._id === user._id)
        );

        setSearch(filteredUsers);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setSearch([]);
    }
  };

  const handleAddMember = (user) => {
    if (!members.some((member) => member._id === user._id)) {
      setMembers((prevMembers) => [...prevMembers, user]);
      setSearch(search.filter((searchedUser) => searchedUser._id !== user._id));
    }
  };

  const handalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSearch([]);
      const payload = {
        name: name,
        users: JSON.stringify(members.map((member) => member._id)) // Ensure this is stringified as an array of strings
      };
      const response = await fetch(`/api/chat/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),  // Stringify the entire payload
      });
  
      if (!response.ok) {
        toast.error("Error creating the group");
        throw new Error("Failed to start chat");
      }
  
      const data = await response.json();
      setChats((prevChats) => [data, ...prevChats]);
      toast.success("Group created");
      setMembers([]);
      toggle();
    } catch (error) {
      toast.error(error)
      console.error("Error starting chat:", error);
    }
  };
  
  
  const handleRemoveMember = (userId) => {
    setMembers(members.filter((member) => member._id !== userId));
    const removedMember = members.find((member) => member._id === userId);
    if (removedMember) {
      setSearch((prevSearch) => [...prevSearch, removedMember]); // Add back to search list if removed
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="dark:bg-[#414C50] rounded-lg shadow-lg px-16 py-3 text-blue-light">
        <form>
          <div className="text-xl font-semibold flex items-center justify-between tracking-widest">
            <h1>{name ? name : "Create a Group"}</h1>
            <button
              onClick={toggle}
              className="text-red-600 px-4 py-2 rounded-lg hover:text-red-800"
            >
              <FaXmark />
            </button>
          </div>
          <div className="">
            <label className="text-base font-medium">
              Group name
            </label>
            <div className="mt-2">
              <input
                placeholder="Name of the group"
                required
                type="text"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2 py-1 bg-transparent focus:outline-none focus:border-0 border-2 border-navyBlue-light rounded-xl font-semibold tracking-wide"
              />
            </div>
          </div>
          <div>
            <label className="text-base font-medium">
              Members
            </label>
            <div className="mt-2">
              {members.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div className="flex gap-2">
                    <img
                      src={`https://avatar.iran.liara.run/public/boy?username=${user.username}`}
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <p className="text-base">{user.name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(user._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-base font-medium">
              Search for member
            </label>
            <div className="mt-1 flex gap-3">
              <input
                placeholder="Search for member"
                type="search"
                onChange={handleUserSearch}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={handalSubmit}
                className="py-1 bg-green-700 px-3 my-auto text-white rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </form>

        <div className="relative max-w-lg h-xs mt-2">
          <div className="absolute bg-white w-full text-xl overflow-y-scroll max-h-56">
            {search.length > 0 &&
              search.map((searchedUser) => (
                <div
                  key={searchedUser._id}
                  className="flex border-2 hover:border-gray-700 m-1 hover:bg-navyBlue-light p-1 gap-2 cursor-pointer transition-all duration-300 hover:rounded-xl"
                  onClick={() => handleAddMember(searchedUser)}
                >
                  <img
                    src={`https://avatar.iran.liara.run/public/${searchedUser.username}`}
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
        </div>
      </div>
    </div>
  );
}

export default CreateGroupChat;
