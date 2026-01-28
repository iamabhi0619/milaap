"use client";

import {
  type Emoji,
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from "frimousse";
import { LoaderIcon, SearchIcon } from "lucide-react";
import type * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const FREQUENT_EMOJIS_KEY = "frequent-emojis";
const MAX_FREQUENT_EMOJIS = 7;

function useFrequentEmojis() {
  const [frequentEmojis, setFrequentEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FREQUENT_EMOJIS_KEY);
    if (stored) {
      try {
        setFrequentEmojis(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse frequent emojis", e);
      }
    }
  }, []);

  const addEmoji = (emoji: Emoji) => {
    setFrequentEmojis((prev) => {
      const filtered = prev.filter((e) => e.emoji !== emoji.emoji);
      const newList = [emoji, ...filtered].slice(0, MAX_FREQUENT_EMOJIS);
      localStorage.setItem(FREQUENT_EMOJIS_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const clearFrequentEmojis = () => {
    setFrequentEmojis([]);
    localStorage.removeItem(FREQUENT_EMOJIS_KEY);
  };

  return { frequentEmojis, addEmoji, clearFrequentEmojis };
}

const EmojiPickerContext = createContext<{
  onEmojiSelect?: (emoji: Emoji) => void;
  frequentEmojis: Emoji[];
  clearFrequentEmojis: () => void;
}>({ frequentEmojis: [], clearFrequentEmojis: () => { } });

function EmojiPicker({
  className,
  onEmojiSelect,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  const { frequentEmojis, addEmoji, clearFrequentEmojis } = useFrequentEmojis();

  const handleEmojiSelect = (emoji: Emoji) => {
    addEmoji(emoji);
    onEmojiSelect?.(emoji);
  };

  return (
    <EmojiPickerContext.Provider
      value={{ onEmojiSelect: handleEmojiSelect, frequentEmojis, clearFrequentEmojis }}
    >
      <EmojiPickerPrimitive.Root
        className={cn(
          "bg-popover text-popover-foreground isolate flex h-full w-fit flex-col overflow-hidden rounded-md",
          className
        )}
        data-slot="emoji-picker"
        onEmojiSelect={handleEmojiSelect}
        {...props}
      />
    </EmojiPickerContext.Provider>
  );
}

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <div
      className={cn("flex h-9 items-center gap-2 border-b px-3", className)}
      data-slot="emoji-picker-search-wrapper"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <EmojiPickerPrimitive.Search
        className="outline-hidden placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        data-slot="emoji-picker-search"
        {...props}
      />
    </div>
  );
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="scroll-my-1 px-1" data-slot="emoji-picker-row">
      {children}
    </div>
  );
}

function EmojiPickerEmoji({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      className={cn(
        "data-active:bg-accent flex size-10 items-center justify-center rounded-sm text-3xl",
        className
      )}
      data-slot="emoji-picker-emoji"
    >
      {emoji.emoji}
    </button>
  );
}

function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="bg-popover text-muted-foreground px-3 pb-2 pt-3.5 text-xs leading-none"
      data-slot="emoji-picker-category-header"
    >
      {category.label}
    </div>
  );
}

function EmojiPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  const { frequentEmojis, onEmojiSelect, clearFrequentEmojis } = useContext(EmojiPickerContext);

  return (
    <EmojiPickerPrimitive.Viewport
      className={cn("outline-hidden relative flex-1", className)}
      data-slot="emoji-picker-viewport"
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="size-4 animate-spin" />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm"
        data-slot="emoji-picker-empty"
      >
        No emoji found.
      </EmojiPickerPrimitive.Empty>
      {frequentEmojis.length > 0 && (
        <div className="px-1">
          <div className="bg-popover text-muted-foreground px-3 pb-2 pt-3.5 text-xs leading-none flex items-center justify-between">
            Frequently Used
            <button
              onClick={clearFrequentEmojis}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap px-1">
            {frequentEmojis.map((emoji) => (
              <button
                key={emoji.emoji}
                className={cn(
                  "flex size-10 items-center justify-center rounded-sm text-3xl hover:bg-accent",
                )}
                onClick={() => onEmojiSelect?.(emoji)}
                title={emoji.label}
              >
                {emoji.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      <EmojiPickerPrimitive.List
        className="select-none pb-1"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
        data-slot="emoji-picker-list"
      />
    </EmojiPickerPrimitive.Viewport>
  );
}

function EmojiPickerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-(--frimousse-viewport-width) flex w-full min-w-0 items-center gap-1 border-t p-2",
        className
      )}
      data-slot="emoji-picker-footer"
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <div className="flex size-10 flex-none items-center justify-center text-3xl">
                {emoji.emoji}
              </div>
              <span className="text-muted-foreground truncate text-xs">
                {emoji.label}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground ml-1.5 flex h-7 items-center truncate text-xs">
              Select an emoji…
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
    </div>
  );
}

export {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
};