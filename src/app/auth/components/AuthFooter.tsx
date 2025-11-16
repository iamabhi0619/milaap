"use client";

import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="mt-auto pt-6 space-y-4">
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground font-medium">
        <Link
          href="https://www.iamabhi.tech/term"
          className="hover:text-foreground hover:underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </Link>
        <Link
          href="https://www.iamabhi.tech/privacy-policy"
          className="hover:text-foreground hover:underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
        <Link
          href="https://www.iamabhi.tech/contact"
          className="hover:text-foreground hover:underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
