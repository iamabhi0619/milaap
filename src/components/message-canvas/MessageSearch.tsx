"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface MessageSearchProps {
  onSearch: (query: string) => void;
  resultsCount?: number;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ onSearch, resultsCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Search Toggle Button */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-9 w-9"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}

      {/* Expandable Search Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1"
          >
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 h-8 w-48"
              autoFocus
            />
            {resultsCount > 0 && (
              <Badge variant="secondary" className="shrink-0">
                {resultsCount}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-7 w-7 shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageSearch;
