"use client";

import { useState, useEffect, use } from "react";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/auth/components/LoginForm";
import SignupForm from "@/app/auth/components/SignupForm";
import AuthFooter from "@/app/auth/components/AuthFooter";
import LeftSection from "./components/LeftSection";
import { Card } from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";

type AuthType = "login" | "signup";

export default function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { isAuthenticated } = useUserStore();
  const [type, setType] = useState<AuthType>("login");
  const router = useRouter();

  // Unwrap searchParams Promise
  const params = use(searchParams);

  useEffect(() => {
    if (params.view === "signup" || params.view === "login") {
      setType(params.view as AuthType);
    }
  }, [params.view]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const toggleFormType = () => {
    setType(type === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="flex flex-col md:flex-row w-full p-0 gap-0 max-w-5xl h-full sm:min-h-[70vh]">
        {/* Left graphic section */}
        <LeftSection />

        {/* Form section */}
        <div className="w-full md:w-1/2 px-6 py-8 flex flex-col">
          <Link
            href="/landing"
            className="text-sm text-muted-foreground font-medium hover:text-foreground inline-flex items-center gap-1 transition-colors group mb-6"
            aria-label="Go back to home page"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              <IconArrowLeft size={18} />
            </span>
            Back to website
          </Link>

          <div className="flex-1">
            {type === "login" ? (
              <LoginForm onToggleForm={toggleFormType} />
            ) : (
              <SignupForm onToggleForm={toggleFormType} />
            )}
          </div>

          {/* Footer Links */}
          <AuthFooter />
        </div>
      </Card>
    </div>
  );
}
