"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreTriggerProps {
  onLoadMore?: () => void;
  loading?: boolean;
}

const LoadMoreTrigger: React.FC<LoadMoreTriggerProps> = ({ onLoadMore, loading = false }) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, onLoadMore]);

  return (
    <div ref={triggerRef} className="flex justify-center py-4">
      {loading ? (
        <Button variant="ghost" disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading messages...
        </Button>
      ) : (
        <Button variant="ghost" onClick={onLoadMore} size="sm">
          Load older messages
        </Button>
      )}
    </div>
  );
};

export default LoadMoreTrigger;
