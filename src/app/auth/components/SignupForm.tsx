"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/stores/userStore";
import { IconUser, IconMail, IconLock, IconAlertCircle, IconEye, IconEyeClosed, IconLoader3, IconArrowRight } from "@tabler/icons-react";
import { toast } from "sonner";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function SignupForm({ onToggleForm }: { onToggleForm: () => void }) {
  const { register, loading, error } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.gender) {
      errors.gender = "Please select a gender";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register(
      formData.email.trim().toLowerCase(),
      formData.password,
      formData.name.trim(),
      formData.gender
    );

    if (success) {
      toast.success("Account created successfully! Please log in.");
      onToggleForm();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-destructive" };
    if (strength <= 3) return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          Create Account
        </h1>
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onToggleForm}
            className="p-0 h-auto font-semibold text-primary hover:underline"
          >
            Log in
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

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            Full Name
          </Label>
          <div className="relative">
            <IconUser
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-200 ${
                focusedField === "name" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className={`pl-11 h-12 text-base ${validationErrors.name ? "border-destructive" : ""}`}
              required
            />
          </div>
          {validationErrors.name && (
            <p className="text-destructive text-xs flex items-center gap-1.5">
              <IconAlertCircle size={14} />
              {validationErrors.name}
            </p>
          )}
        </div>

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
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`pl-11 h-12 text-base ${validationErrors.email ? "border-destructive" : ""}`}
              required
            />
          </div>
          {validationErrors.email && (
            <p className="text-destructive text-xs flex items-center gap-1.5">
              <IconAlertCircle size={14} />
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Gender Field */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-semibold">
            Gender
          </Label>
          <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger className={`h-12 ${validationErrors.gender ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.gender && (
            <p className="text-destructive text-xs flex items-center gap-1.5">
              <IconAlertCircle size={14} />
              {validationErrors.gender}
            </p>
          )}
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
              placeholder="Create a password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={`pl-11 pr-12 h-12 text-base ${validationErrors.password ? "border-destructive" : ""}`}
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
              {showPassword ? <IconEye className="h-5 w-5" /> : <IconEyeClosed className="h-5 w-5" />}
            </Button>
          </div>
          {formData.password && passwordStrength && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold">{passwordStrength.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use 8+ characters with mix of letters, numbers & symbols
              </p>
            </div>
          )}
          {validationErrors.password && (
            <p className="text-destructive text-xs flex items-center gap-1.5">
              <IconAlertCircle size={14} />
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold">
            Confirm Password
          </Label>
          <div className="relative">
            <IconLock
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-200 ${
                focusedField === "confirmPassword" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              className={`pl-11 pr-12 h-12 text-base ${validationErrors.confirmPassword ? "border-destructive" : ""}`}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2"
              tabIndex={-1}
            >
              {showConfirmPassword ? <IconEye className="h-5 w-5" /> : <IconEyeClosed className="h-5 w-5" />}
            </Button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-destructive text-xs flex items-center gap-1.5">
              <IconAlertCircle size={14} />
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full h-12" size="lg">
          {loading ? (
            <div className="flex items-center gap-2">
              <IconLoader3 className="h-5 w-5 animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign up</span>
              <IconArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
