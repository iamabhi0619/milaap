"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle, IconLoader3 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginWithGoogle() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/v1/google?redirect=${window.location.origin}`);

      // The user will be redirected to Google's OAuth page
      // No need to setLoading(false) as the page will redirect
    } catch (error) {
      console.error("Unexpected error during Google login:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full relative group cursor-pointer"
      size="lg"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <IconLoader3 className="h-5 w-5 animate-spin" />
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <IconBrandGoogle className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-semibold">Continue with Google</span>
        </div>
      )}
    </Button>
  );
}
