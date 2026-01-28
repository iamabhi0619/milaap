import { useEffect, RefObject } from 'react';

interface UseAutoScrollProps {
  isFocused: boolean;
  isTyping: boolean;
  inputContainerRef: RefObject<HTMLDivElement | null>;
}

export const useAutoScroll = ({ isFocused, isTyping, inputContainerRef }: UseAutoScrollProps) => {
  // Auto-scroll to keep input visible when keyboard opens on mobile
  useEffect(() => {
    if (isFocused) {
      const scrollInputIntoView = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const extraPadding = 100;

        window.scrollTo({
          top: scrollHeight - windowHeight + extraPadding,
          behavior: 'smooth',
        });

        if (inputContainerRef.current) {
          inputContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      };

      const timer1 = setTimeout(scrollInputIntoView, 100);
      const timer2 = setTimeout(scrollInputIntoView, 300);
      const timer3 = setTimeout(scrollInputIntoView, 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isFocused, inputContainerRef]);

  // Also scroll when typing starts
  useEffect(() => {
    if (isTyping && isFocused) {
      const scrollToBottom = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const extraPadding = 100;

        window.scrollTo({
          top: scrollHeight - windowHeight + extraPadding,
          behavior: 'smooth',
        });
      };
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping, isFocused]);
};
