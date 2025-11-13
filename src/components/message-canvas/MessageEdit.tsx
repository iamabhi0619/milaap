"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface MessageEditProps {
  initialText: string;
  onSave: (newText: string) => Promise<void>;
  onCancel: () => void;
}

const MessageEdit: React.FC<MessageEditProps> = ({ initialText, onSave, onCancel }) => {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim() || text === initialText) {
      onCancel();
      return;
    }

    setSaving(true);
    try {
      await onSave(text);
    } catch (error) {
      console.error("Failed to save edit:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg"
    >
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Edit message..."
        className="flex-1"
        autoFocus
        disabled={saving}
      />
      <Button size="sm" onClick={handleSave} disabled={saving || !text.trim()}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
        Cancel
      </Button>
    </motion.div>
  );
};

export default MessageEdit;
