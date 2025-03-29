"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "@/assets/Logo";

function Page() {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chats");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen flex flex-col items-center bg-white text-navyLight p-6 sm:px-12 md:px-20 lg:px-32 justify-between overflow-y-hidden gap-3">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center">
        <motion.div
          className="flex items-center w-32 gap-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
          <h1 className="text-2xl font-bold text-navyLight tracking-wide">Millap</h1>
        </motion.div>
        <motion.div
          className="space-x-4 sm:space-x-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={() => router.push("/auth/login")} className="text-navy cursor-pointer font-semibold tracking-wide text-lg hover:underline underline-offset-2">Login</button>
          <button onClick={() => router.push("/auth/signup")} className="bg-navy cursor-pointer text-white px-4 py-1.5 rounded-full font-semibold shadow-lg hover:bg-navyLightest">
            Sign Up
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center text-center my-auto space-y-3 sm:space-y-6 grow-1 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold">Let&apos;s Connect with Friends in Real Time</h1>
        <p className="text-lg text-navy max-w-2xl">Experience seamless, secure, and efficient conversations with Millap. Stay connected anytime, anywhere.</p>
        <motion.button
          onClick={() => router.push("/auth/signup")}
          className="bg-navyLightest text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-navy cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Chatting Now
        </motion.button>

        {/* Tech Stack Section */}
        <motion.section
          className="w-full text-center py-6 bg-gray-100 rounded-lg shadow-md px-4 sm:px-6 md:px-8 sm:space-y-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold">Built with Modern Technologies</h2>
          <p className="text-lg text-navyLight">Millap is powered by a robust and scalable tech stack.</p>
          <div className="flex flex-wrap justify-center gap-2 text-lg font-semibold">
            <span>Next.js</span> • <span>Supabase</span> • <span>Tailwind CSS</span> • <span>Zustand</span> • <span>JWT</span>
          </div>
        </motion.section>
      </motion.div>



      {/* About the Developer */}
      <motion.footer
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold">About the Developer</h2>
        <p className="text-lg text-navy mt-2">
          Hi, I&apos;m <a href="https://iamabhi.tech" target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:italic hover:underline">Abhishek Kumar</a>, a passionate full-stack web developer. I built Millap to provide a seamless messaging experience. Let&apos;s innovate together!
        </p>
      </motion.footer>
    </div>
  );
}

export default Page;