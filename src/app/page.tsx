"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

function Page() {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chats");
    }
  }, [isAuthenticated, router]);

  return <div>Checking authentication...</div>;
}

export default Page;
