"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/assets/Logo";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const loginUser = useUserStore((state) => state.login);


  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(email, password);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-white w-full flex justify-center items-center">
      <div className="w-full max-w-md px-4">
        <div className="w-full max-w-xs flex items-center mx-auto">
          <Logo />
        </div>
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center pb-1 text-navy">Sign In to Millap</h2>
          <p className="text-lg text-navLightest text-center tracking-wide mt-3">
            First time here?
            <Link href="/auth/signup" className="text-navy hover:underline"> Sign Up</Link>
          </p>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4 text-xl py-3 text-navy">
            <div className="flex items-center gap-2 border-b border-navy">
              <input
                type="email"
                className="w-full py-2 outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={30} className="text-navy" />
            </div>
            <div className="flex items-center gap-2 border-b border-navy">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full py-2 outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="cursor-pointer text-navy"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={30} /> : <EyeOff size={30} />}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                title="rememberMe"
                name="rememberMe"
                className="w-5 h-5"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </div>
            <button
              type="submit"
              className="w-full bg-navy text-white font-bold tracking-wide text-2xl py-3 rounded-lg hover:bg-navyLight transition-all duration-500 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
