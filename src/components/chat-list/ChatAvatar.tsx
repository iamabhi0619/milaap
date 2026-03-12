"use client";
import NextImage from 'next/image';
import React from 'react';
import { IconUsers } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface ChatAvatarProps {
  avatar?: string | null;
  displayName: string;
  isGroup: boolean;
  isActive: boolean;
}

const getInitials = (name: string) => {
  const safeName = name.trim();
  if (!safeName) return 'U';

  return safeName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function ChatAvatar({ avatar, displayName, isGroup, isActive }: ChatAvatarProps) {
  const [loadedAvatar, setLoadedAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoadedAvatar(null);

    if (!avatar) {
      return;
    }

    const preloadImage = new window.Image();

    preloadImage.onload = () => {
      setLoadedAvatar(avatar);
    };

    preloadImage.onerror = () => {
      setLoadedAvatar(null);
    };

    preloadImage.src = avatar;

    return () => {
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, [avatar]);

  return (
    <div
      className={cn(
        'relative h-11 w-11 shrink-0 overflow-hidden rounded-full border bg-muted',
        isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border group-hover:border-primary/40'
      )}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full text-sm font-semibold leading-none text-muted-foreground">
        {getInitials(displayName)}
      </div>

      {loadedAvatar ? (
        <NextImage
          src={loadedAvatar}
          alt={displayName}
          fill
          unoptimized
          sizes="48px"
          className="absolute inset-0 rounded-full object-cover"
        />
      ) : null}

      {isGroup && (
        <span className="absolute right-0 bottom-0 z-10 inline-flex size-3 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
          <IconUsers className="size-2" />
        </span>
      )}
    </div>
  );
}
