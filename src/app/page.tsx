"use client";

import { useUserStore } from "@/stores/userStore";
import LandingPage from "./landing/page";
import ChatsPage from "./chats/page";

export default function Page() {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <ChatsPage />;
}
