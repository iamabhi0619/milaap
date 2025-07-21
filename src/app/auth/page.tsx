"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthType = "login" | "signup";

export default function Page() {
  const { login, loading, error, register, forgetPassword } = useUserStore();
  const [type, setType] = useState<AuthType>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    emailRef.current?.focus();
  }, [type]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      if (type === "signup") {
        const result = await register(data.email, data.password, data.name, data.gender);
        if (result) {
          setType("login");
          setMessage("Signup successful! Please log in.");
        }
      } else if (type === "login") {
        const success = await login(data.email, data.password, true);
        if (success) {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const toggleFormType = () => {
    setType(type === "login" ? "signup" : "login");
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBlue p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden shadow-blue/50">
        {/* Left graphic section */}
        <div
          className="h-40 md:h-auto md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/authbg.svg')" }}
        />

        {/* Form section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-6 md:p-10"
        >
          <Link href="/" className="text-sm text-navy font-overpass-mono font-bold hover:underline ">
            &larr; Back to website
          </Link>

          <h2 className="text-4xl font-bold mt-4 text-blue font-overpass">
            {type === "login" ? "Welcome back!" : "Create an account"}
          </h2>
          <p className="text-navyLight font-overpass text-sm mb-6">
            {type === "login"
              ? "Log in to your account to continue."
              : "Sign up for free and get started!"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 font-overpass text-lg font-semibold">
            {type === "signup" && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full border rounded-full p-3 text-sm outline-none focus:ring-2 focus:ring-green"
                  autoFocus
                />
                <select
                  name="gender"
                  className="w-full border rounded-full p-3 text-sm outline-none focus:ring-2 focus:ring-green"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              ref={emailRef}
              className="w-full border rounded-full p-3 text-sm outline-none focus:ring-2 focus:ring-green"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full border rounded-full p-3 text-sm outline-none focus:ring-2 focus:ring-green"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>

            {type === "login" && (
              <div className="text-right">
                <p
                  onClick={async () => {
                    const email = emailRef.current?.value;
                    if (!email) {
                      toast.error("Please enter your email to reset password.");
                    } else {
                      await forgetPassword(email);
                    }
                  }}
                  className="text-sm text-navyLightest hover:text-navy font-overpass-mono hover:underline underline-offset-1 -tracking-wide transition cursor-pointer"
                >
                  Forgot password?
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center bg-green text-white cursor-pointer font-FiraCode font-semibold rounded-full py-3 transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green/80"
                }`}
            >
              {loading ? (
                <motion.div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : type === "login" ? (
                "Log in"
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          {/* Success/Error messages */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red mt-4 text-center font-FiraCode font-semibold"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-green mt-4 text-sm"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center font-overpass">
            <button
              type="button"
              onClick={toggleFormType}
              className="text-sm text-blue font-semibold hover:underline transition-all cursor-pointer"
            >
              {type === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-navy font-overpass font-semibold">
            <Link
              href={"https://www.iamabhi.tech/term"}
              className="hover:text-navyLightest hover:underline transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>
            <Link
              href={"https://www.iamabhi.tech/privacy-policy"}
              className="hover:text-navyLightest hover:underline transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            <Link
              href={"https://www.iamabhi.tech/contact"}
              className="hover:text-navyLightest hover:underline transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Support
            </Link>
            <span className="text-navy font-overpass-mono -tracking-wide">Social logins coming soon 🚀</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
