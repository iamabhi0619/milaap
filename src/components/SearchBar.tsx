import { Search } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/userStore";
import { useChatStore } from "@/stores/chatStore";

/**
 * =============================================================================
 * SearchBar (Milaap)
 * -----------------------------------------------------------------------------
 * - Production‑ready, accessible user search & DM creation component.
 * - Supabase for data, Zustand stores for auth + chat actions.
 * - Debounced, cancellable queries; keyboard & pointer interactions.
 * - Calls `addDM` to create or get direct message chat.
 * =============================================================================
 */

interface DBUser {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  gender: string | null;
}

const DEBOUNCE_MS = 500;

const SearchBar: React.FC = () => {
  // ----------------------------- Local state ---------------------------------
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<DBUser[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // ------------------------------ Stores -------------------------------------
  const { user } = useUserStore();
  const { addDM } = useChatStore();

  // ------------------------------ Refs ---------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  // --------------------------- Helpers ---------------------------------------
  const resetSearch = useCallback(() => {
    setQuery("");
    setUsers([]);
    setError(null);
    setHighlightedIndex(-1);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
    resetSearch();
  }, [resetSearch]);

  // ------------------------- Outside click -----------------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  // ---------------------- Debounced Supabase search --------------------------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setUsers([]);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // Cancel previous request if still in‑flight
      abortController.current?.abort();
      abortController.current = new AbortController();

      const term = query.trim();
      const { data, error: supaErr } = await supabase
        .from("users")
        .select("id, userId, name, avatar, gender")
        .ilike("name", `%${term}%`) // TODO: extend with .or for username/email
        .neq("id", user?.id ?? "") // exclude self
        .abortSignal(abortController.current.signal);

      if (supaErr && supaErr.name !== "AbortError") {
        console.error("Supabase search error", supaErr);
        setError("Failed to fetch users");
        setUsers([]);
        return;
      }

      if (!data || data.length === 0) {
        setError("No users found");
        setUsers([]);
      } else {
        setError(null);
        setUsers(data);
      }
      setHighlightedIndex(-1);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // We intentionally *do not* abort here; next effect call will abort previous.
    };
  }, [query, user?.id]);

  // ----------------------- Keyboard navigation -------------------------------
  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!users.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => (i < users.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => (i > 0 ? i - 1 : users.length - 1));
        break;
      case "Enter":
        if (highlightedIndex !== -1) {
          e.preventDefault();
          handleUserSelect(users[highlightedIndex].id);
        }
        break;
      case "Escape":
        closeDropdown();
        break;
    }
  };

  // -------------------- Handle user selection --------------------------------
  const handleUserSelect = useCallback(
    async (selectedUserId: string) => {
      if (!user?.id) return;
      if (selectedUserId === user.id) return; // no self‑chat

      try {
        await addDM(selectedUserId);
      } catch (err) {
        console.error("addDM failed", err);
      }

      closeDropdown();
    },
    [user?.id, addDM, closeDropdown]
  );

  // Keep highlighted item in view
  useEffect(() => {
    if (listRef.current && highlightedIndex !== -1) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  // ---------------------------- Render ---------------------------------------
  return (
    <div ref={containerRef} className="relative flex items-center gap-1 rounded-lg w-full">
      {/* Activator */}
      <button
        aria-label="Search users"
        className="cursor-pointer"
        onClick={() => setIsDropdownOpen(true)}
      >
        <Search strokeWidth={2.5} className="text-white" />
      </button>

      {/* Input */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search users…"
              autoFocus
              className="bg-transparent text-white placeholder-gray-400 border-b border-gray-500 p-1 outline-none"
            />

            {/* Dropdown */}
            <AnimatePresence>
              {(users.length > 0 || error) && (
                <motion.ul
                  key="dropdown"
                  ref={listRef}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute z-20 max-w-full max-h-60 bg-white rounded-b-xl rounded-tr-xl shadow-lg text-navy overflow-y-auto hide-scrollbar"
                  role="listbox"
                >
                  {error ? (
                    <li className="p-2 text-center text-gray-500" role="alert">
                      {error}
                    </li>
                  ) : (
                    users.map((u, i) => (
                      <li
                        key={u.id}
                        role="option"
                        aria-selected={highlightedIndex === i}
                        className={`flex items-center gap-2 p-2 border-b border-navy/10 cursor-pointer ${highlightedIndex === i ? "bg-gray-200" : "hover:bg-gray-100"
                          }`}
                        onMouseEnter={() => setHighlightedIndex(i)}
                        onMouseLeave={() => setHighlightedIndex(-1)}
                        onClick={() => handleUserSelect(u.id)}
                      >
                        <Image
                          src={u.avatar?.trim() || "https://avatar.iran.liara.run/public"}
                          alt={u.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <span>{u.name}</span>
                      </li>
                    ))
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
