import { Search, Users } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useChatCreationStore } from "@/stores/chatCreation";
import { useUserStore } from "@/stores/userStore";

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
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const { createOneToOneChat } = useChatCreationStore();

  const { user, convertMongoIdToUUID } = useUserStore();

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
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (axios.isAxiosError(error)) {
              setError(error.response?.data?.message)
            } else {
              setError("Failed to fetch users")
            }
          }
          else {
            setError("Failed to fetch users");
            setUsers([]);
          }

        }
      }, 800); // 800ms delay

      setTypingTimeout(timeout);
    } else {
      setUsers([]);
      setError(null);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [searchTerm, typingTimeout]);
  const handleUserClick = (id: string) => {
    if (user?.id) {
      createOneToOneChat(user.id, convertMongoIdToUUID(id));
    }
  }

  return (
    <div className="flex items-center gap-1 p-2 rounded-lg relative">
      <div className="cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
        <Search strokeWidth={2.5} className="text-white" />
      </div>
      {isVisible && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white outline-none w-full placeholder-gray-400 border-b border-gray-500 p-1"
            autoFocus
          />
          {(users.length > 0 || error) && (
            <ul className="absolute bg-white text-navy w-60 mt-1 rounded-b-xl shadow-lg shadow-navy rounded-tr-xl max-h-[70vh] overflow-y-scroll hide-scrollbar">
              {error ? (
                <li className="p-2 text-gray-500 text-center">{error}</li>
              ) : (
                users.map((user) => (
                  <li key={user._id} className="p-2 hover:bg-slateLight cursor-pointer flex items-center gap-2 border-b border-navy/10" onClick={() => handleUserClick(user._id)}>
                    <Image src={user?.avatar?.trim() || 'https://avatar.iran.liara.run/public'} alt={user.name} className="w-8 h-8 rounded-full" width={50} height={50} />
                    <span>{user.name}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
      <button onClick={onCreateGroup} className="p-2 rounded-lg text-white flex items-center gap-1" title="Create Group">
        <Users strokeWidth={2} />
      </button>
    </div>
  );
};

export default SearchBar;
