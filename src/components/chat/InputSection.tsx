import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Smile, Loader2 } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { motion } from "framer-motion";
import { useMessageStore } from "@/stores/messageStore";

const InputSection = () => {
    const [message, setMessage] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const { sendMessage } = useMessageStore();

    // Handle sending message
    const handleSendMessage = async () => {
        if (!message.trim() || sending) return;
        setSending(true);
        try {
            await sendMessage(message);
            setMessage(""); // Clear input on successful send
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Message sending failed. Please try again.");
        }
        setSending(false);
    };

    // Handle emoji selection
    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage((prev) => prev + emojiObject.emoji);
    };

    // Handle key press (Enter to send)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents new line on Enter
            handleSendMessage();
        }
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative p-4 bg-white shadow flex items-center gap-2 rounded-lg">
            {/* Emoji Picker Button */}
            <button title="Emoji" onClick={() => setShowEmojiPicker((prev) => !prev)} className="text-gray-500">
                <Smile className="text-xl cursor-pointer" />
            </button>

            {/* Animated Emoji Picker */}
            {showEmojiPicker && (
                <motion.div
                    ref={emojiPickerRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-12 left-2 bg-white shadow-lg rounded-lg p-2"
                >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </motion.div>
            )}

            {/* Message Input */}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Listen for Enter key
                placeholder="Write a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={sending}
            />

            {/* Microphone Button (Placeholder for Voice Messages) */}
            <Mic className="text-gray-500 text-xl cursor-pointer" />

            {/* Animated Send Button */}
            <motion.button
                title="Send"
                onClick={handleSendMessage}
                disabled={sending}
                className="text-blue-500 text-xl cursor-pointer disabled:opacity-50"
                whileTap={{ scale: 0.9 }}
            >
                {sending ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                    >
                        <Loader2 className="animate-spin" />
                    </motion.div>
                ) : (
                    <Send />
                )}
            </motion.button>
        </div>
    );
};

export default InputSection;
