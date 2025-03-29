import { Menu, User, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  chatName: string;
  avatar: string;
  isGroupChat: boolean;
  isTyping: boolean;
  setView: () => void;
};

// Wave animation for dots (scaling effect)
const waveVariants = (delay: number) => ({
  animate: {
    scale: [1, 1.4, 1], // Dots scale up and down
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay, // Different delay for each dot
    },
  },
});

const TopBar = ({ chatName, avatar, isGroupChat, isTyping, setView }: Props) => {
  const DP = avatar ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={avatar}
        alt={chatName}
        height={50}
        width={50}
        className="rounded-full h-10 w-10"
      />
    </motion.div>
  ) : isGroupChat ? (
    <Users className="w-8 h-8 text-gray-500" />
  ) : (
    <User className="w-8 h-8 text-gray-500" />
  );

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-b-3xl">
      <div className="flex items-center gap-2 cursor-pointer">
        {DP}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-start"
        >
          <span className="text-xl font-bold">{chatName}</span>
          {isTyping && (
            <div className="flex items-center space-x-1 text-green-500 font-semibold text-xs">
              <span>Typing</span>
              <div className="flex space-x-0.5">
                <motion.span
                  className="dot"
                  variants={waveVariants(0)}
                  animate="animate"
                >
                  .
                </motion.span>
                <motion.span
                  className="dot"
                  variants={waveVariants(0.15)}
                  animate="animate"
                >
                  .
                </motion.span>
                <motion.span
                  className="dot"
                  variants={waveVariants(0.3)}
                  animate="animate"
                >
                  .
                </motion.span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer"
        onClick={() => { setView() }}
      >
        <Menu />
      </motion.div>
    </div>
  );
};

export default TopBar;
