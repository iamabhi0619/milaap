"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiReactionPickerProps {
  onReact: (emoji: string) => void;
  messageId: string;
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "🎉"];

const EmojiReactionPicker: React.FC<EmojiReactionPickerProps> = ({ onReact, messageId }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(messageId)
  const handleReaction = (emoji: string) => {
    onReact(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="center">
        <div className="flex gap-1">
          {QUICK_REACTIONS.map((emoji) => (
            <motion.div
              key={emoji}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-secondary"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            </motion.div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiReactionPicker;
