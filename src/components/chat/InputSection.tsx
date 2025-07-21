"use client";

import React, { useState, useRef } from "react";
import { Send, Mic, Smile, Bold, Italic, Strikethrough, Code, Loader2 } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { motion } from "framer-motion";
import { useMessageStore } from "@/stores/messageStore";

const formattingOptions = [
    { symbol: "**", label: "Bold", icon: <Bold /> },
    { symbol: "_", label: "Italic", icon: <Italic /> },
    { symbol: "~", label: "Strikethrough", icon: <Strikethrough /> },
    { symbol: "`", label: "Monospace", icon: <Code /> },
];

const InputSection = () => {
    const [message, setMessage] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { sendMessage } = useMessageStore();

    // Apply Formatting to Selected Text
    const applyFormatting = (symbol: string) => {
        if (!inputRef.current || !selection) return;
        const { start, end } = selection;
        if (start === end) return;
        const selectedText = message.substring(start, end);
        const newText =
            message.substring(0, start) +
            `${symbol}${selectedText}${symbol}` +
            message.substring(end);
        setMessage(newText);
        setSelection(null); // Hide menu after applying format
    };

    // Handle text selection
    const handleSelection = () => {
        if (!inputRef.current) return;
        const input = inputRef.current;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        if (start !== end) {
            setSelection({ start, end });
        } else {
            setSelection(null);
        }
    };

    // Handle key press (Enter to send, Tab to insert suggestion)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents new line on Enter
            handleSendMessage();
        }
        if (event.key === "Tab") {
            event.preventDefault();
        }
    };

    // Handle sending message
    const handleSendMessage = async () => {
        if (!message.trim() || sending) return;
        setSending(true);
        try {
            await sendMessage(message);
            setMessage("");
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

    return (
        <div className="relative p-4 bg-white shadow flex items-center gap-2 rounded-lg">
            {/* Floating Formatting Menu */}
            {selection && (
                <div className="absolute bottom-12 left-2 bg-white shadow-lg rounded-lg p-2 flex gap-2 border">
                    {formattingOptions.map((option, index) => (
                        <button
                            key={index}
                            title={option.label}
                            onClick={() => applyFormatting(option.symbol)}
                            className="p-1 text-gray-600 hover:text-black"
                        >
                            {option.icon}
                        </button>
                    ))}
                </div>
            )}

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
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onSelect={handleSelection}
                onKeyDown={handleKeyDown} // Attach the keydown event listener here
                placeholder="Write a message..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
