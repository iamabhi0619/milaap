"use client";
import { useState } from "react";
import Logo from "@/assets/Logo";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import Link from "next/link";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!gender) {
            setError("Please select a gender");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setSuccessMessage("Verification email sent. Please check your inbox.");
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="h-screen bg-white w-full flex justify-center items-center">
            <div className="w-full max-w-md px-4">
                <div className="w-full max-w-xs flex items-center mx-auto">
                    <Logo />
                </div>
                <div className="w-full">
                    <h2 className="text-3xl font-bold text-center pb-1 text-navy">Sign Up for Millap</h2>
                    <p className="text-lg text-navLightest text-center tracking-wide mt-3">
                        Already have an account?
                        <Link href="/auth/login" className="text-navy hover:underline"> Login</Link>
                    </p>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {successMessage && <p className="text-green-800 font-semibold text-center">{successMessage}</p>}
                    <form onSubmit={handleSignup} className="space-y-4 text-xl py-3 text-navy">
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
                            <div className="cursor-pointer text-navy" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <Eye size={30} /> : <EyeOff size={30} />}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 border-b border-navy">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full py-2 outline-none"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 border-b border-navy">
                            <select
                                className="w-full py-2 outline-none bg-white"
                                value={gender}
                                name="gender"
                                title="gender"
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <User size={30} className="text-navy" />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-navy text-white font-bold tracking-wide text-2xl py-3 rounded-lg hover:bg-navyLight transition-all duration-500 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;