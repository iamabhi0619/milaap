import { Search, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { useChatCreationStore } from "@/stores/chatCreation";
import { useUserStore } from "@/stores/userStore";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  _id: string;
  userID: string;
  name: string;
  avatar: string;
  gender: string;
}

interface SearchBarProps {
  onCreateGroup: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCreateGroup }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const { createOneToOneChat } = useChatCreationStore();
  const { user, convertMongoIdToUUID } = useUserStore();

  const searchRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Handle outside click to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users on search input change
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    if (searchTerm.trim()) {
      const timeout = setTimeout(async () => {
        try {
          const res = await axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/user/search?search=${searchTerm}`);

          if (res.data.length === 0) {
            setError("No users found");
            setUsers([]);
          } else {
            setUsers(res.data);
            setError(null);
          }
        } catch {
          setError("Failed to fetch users");
          setUsers([]);
        }
      }, 800);

      setTypingTimeout(timeout);
    } else {
      setUsers([]);
      setError(null);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [searchTerm]);

  // Handle user selection with mouse click
  const handleUserClick = (id: string) => {
    if (user?.id) {
      createOneToOneChat(user.id, convertMongoIdToUUID(id));
      setIsVisible(false);
      setSearchTerm("");
    }
  };

  // Handle keyboard navigation (Arrow Up, Arrow Down, Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!users.length) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      handleUserClick(users[selectedIndex]._id);
    }
  };

  useEffect(() => {
    if (listRef.current && selectedIndex !== -1) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="flex items-center gap-1 p-2 rounded-lg relative" ref={searchRef}>
      {/* Search Icon Click to Show Input */}
      <div className="cursor-pointer" onClick={() => setIsVisible(true)}>
        <Search strokeWidth={2.5} className="text-white" />
      </div>

      {/* Animated Search Input */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white outline-none w-full placeholder-gray-400 border-b border-gray-500 p-1"
              autoFocus
            />

            {/* Animated User List Dropdown */}
            <AnimatePresence>
              {(users.length > 0 || error) && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute bg-white text-navy w-60 mt-1 rounded-b-xl shadow-lg shadow-navy rounded-tr-xl max-h-[200px] overflow-y-auto hide-scrollbar"
                  ref={listRef}
                >
                  {error ? (
                    <motion.li className="p-2 text-gray-500 text-center">{error}</motion.li>
                  ) : (
                    users.map((user, index) => (
                      <motion.li
                        key={user._id}
                        className={`p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 border-b border-navy/10 ${selectedIndex === index ? "bg-gray-300" : ""
                          }`}
                        onClick={() => handleUserClick(user._id)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src={user?.avatar?.trim() || "https://avatar.iran.liara.run/public"}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                          width={50}
                          height={50}
                        />
                        <span>{user.name}</span>
                      </motion.li>
                    ))
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Group Button */}
      <button onClick={onCreateGroup} className="p-2 rounded-lg text-white flex items-center gap-1" title="Create Group">
        <Users strokeWidth={2} />
      </button>
    </div>
  );
};

export default SearchBar;
