"use client";

import { IconEye, IconEyeOff, IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";

interface PasswordInputProps {
  name: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
  showStrength?: boolean;
  onChange?: (value: string) => void;
  ariaDescribedby?: string;
}

export default function PasswordInput({
  name,
  placeholder,
  error,
  autoComplete = "current-password",
  showStrength = false,
  onChange,
  ariaDescribedby,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "text-red-500" };
    if (strength <= 3) return { strength, label: "Fair", color: "text-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "text-blue-500" };
    return { strength, label: "Strong", color: "text-green-500" };
  };

  const [passwordValue, setPasswordValue] = useState("");
  const passwordStrength = showStrength ? getPasswordStrength(passwordValue) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-full p-3 pr-10 text-sm outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-green'}`}
          autoComplete={autoComplete}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={ariaDescribedby}
          onChange={handleChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-4 flex items-center gap-1">
          <IconAlertCircle size={14} />
          {error}
        </p>
      )}
      {showStrength && passwordValue && passwordStrength && (
        <div className="mt-2 ml-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  passwordStrength.label === "Weak" ? "bg-red-500" :
                  passwordStrength.label === "Fair" ? "bg-yellow-500" :
                  passwordStrength.label === "Good" ? "bg-blue-500" :
                  "bg-green-500"
                }`}
                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-semibold ${passwordStrength.color}`}>
              {passwordStrength.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Use 8+ characters with mix of letters, numbers & symbols
          </p>
        </div>
      )}
    </div>
  );
}
