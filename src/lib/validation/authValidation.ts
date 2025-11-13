export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender?: string;
}

export function validateAuthForm(
  data: AuthFormData,
  type: "login" | "signup"
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation (signup only)
  if (type === "signup") {
    if (!data.name?.trim()) {
      errors.name = "Name is required";
    } else if (data.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (data.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.name.trim())) {
      errors.name = "Name can only contain letters, spaces, hyphens and apostrophes";
    }
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (type === "signup") {
    // Additional signup password requirements
    if (data.password.length > 128) {
      errors.password = "Password must be less than 128 characters";
    } else if (!/[a-z]/.test(data.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(data.password)) {
      errors.password = "Password must contain at least one number";
    }

    // Confirm password validation (signup only)
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}
