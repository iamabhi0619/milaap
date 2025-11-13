"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserStore } from "@/stores/userStore";
import { FormEvent, useState } from "react";
import { IconMail, IconLock, IconArrowRight, IconAlertCircle, IconEye, IconEyeClosed, IconLoader3 } from "@tabler/icons-react";
import { toast } from "sonner";

export default function LoginForm({ onToggleForm }: { onToggleForm: () => void }) {
  const { login, forgetPassword, loading, error } = useUserStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    await login(email.trim().toLowerCase(), password, rememberMe);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address first");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const result = await forgetPassword(email.toLowerCase());
    if (result) {
      toast.success("Password reset link sent! Check your email.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back!
        </h1>
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onToggleForm}
            className="p-0 h-auto font-semibold text-primary hover:underline"
          >
            Sign up
          </Button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <IconAlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email Address
          </Label>
          <div className="relative">
            <IconMail
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-200 ${
                focusedField === "email" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="pl-11 h-12 text-base"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <div className="relative">
            <IconLock
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-200 ${
                focusedField === "password" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="pl-11 pr-12 h-12 text-base"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2"
              tabIndex={-1}
            >
              {showPassword ? (
                <IconEye className="h-5 w-5" />
              ) : (
                <IconEyeClosed className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm cursor-pointer font-medium">
              Remember me
            </Label>
          </div>
          <Button
            type="button"
            variant="link"
            onClick={handleForgotPassword}
            className="text-sm p-0 h-auto font-semibold"
          >
            Forgot password?
          </Button>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full h-12" size="lg">
          {loading ? (
            <div className="flex items-center gap-2">
              <IconLoader3 className="h-5 w-5 animate-spin" />
              <span>Logging in...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Log in</span>
              <IconArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
