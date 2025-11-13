"use client";

import { IconAlertCircle } from "@tabler/icons-react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ type, name, placeholder, error, autoComplete, maxLength, autoFocus }, ref) => {
    return (
      <div className="space-y-2">
        <Input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          className={`${error ? 'border-destructive focus-visible:ring-destructive' : ''} h-11 transition-all`}
          autoComplete={autoComplete}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          maxLength={maxLength}
          autoFocus={autoFocus}
        />
        {error && (
          <p id={`${name}-error`} className="text-destructive text-xs flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
            <IconAlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
