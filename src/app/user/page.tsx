"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { BookUser, Loader2, Mars, PenLine, Venus } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";

interface User {
    _id: string;
    userId: string;
    name: string;
    email: string;
    gender: string;
    bio: string;
    avatar: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    isNewsletters: boolean;
    settings: {
        theme: string;
        language: string;
        notifications: boolean;
    }
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get<User>(
                `http://localhost:5050/api/user/profile`, // TODO: Replace with actual API endpoint
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        setImageUploading(true);
        setError(null);
        try {
            const imageUrl = await uploadToCloudinary(file);
            console.log(imageUrl);

            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.put<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
                { avatar: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            getUserProfile();
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image. Please try again.");
        } finally {
            setImageUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-4 px-4 flex flex-col gap-6 bg-slateLight/20 h-screen overflow-y-auto"
        >
            {/* Avatar and Upload With name and email */}
            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-xl">
                <div className="flex flex-col items-center relative w-24">
                    <div className="relative group">
                        {imageUploading ? (
                            <Loader2 className="w-20 h-20 animate-spin text-gray-500" />
                        ) : (
                            <Image
                                src={user?.avatar || "https://avatar.iran.liara.run/public"}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                                className="rounded-full border border-navy shadow-lg"
                            />
                        )}
                        <div className="absolute inset-0 flex items-center rounded-full justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <PenLine className="text-white" />
                        </div>
                        <input
                            title="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={imageUploading}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-navy">{user?.name || "N/A"}</h2>
                    <p className="text-navyLightest">{user?.email}</p>
                </div>
            </div>

            {/* User Details */}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-xl">
                {loading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-gray-500 mx-auto" />
                ) : (
                    <>
                        <motion.p className="text-xl font-bold tracking-wide text-navyLightest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>General</motion.p>
                        <motion.div className="flex items-center gap-3 bg-slate-100 p-4 rounded-lg shadow" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                            <div className="bg-navy/90 flex items-center text-white rounded-full p-2">
                                <BookUser size={25} fill="#0a192f" />
                            </div>
                            <p className="text-lg font-semibold">Bio</p>
                            <p>{user?.bio || "N/A"}</p>
                        </motion.div>
                        <motion.div className="flex items-center gap-3 bg-slate-100 p-4 rounded-lg shadow" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                            <p className="bg-navy/90 flex items-center text-white rounded-full p-2">{user?.gender === 'male' ? <Mars size={25} fill="#0a192f" /> : <Venus size={25} fill="#0a192f" />}</p>
                            <p className="text-lg font-semibold uppercase">{user?.gender || "N/A"}</p>
                        </motion.div>
                        <motion.div className="bg-slate-100 p-4 rounded-lg shadow space-y-3" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
                            <p className="text-lg font-semibold">Account Details</p>
                            <p>{user?.isVerified ? <span className="bg-green text-navy px-4 py-1 font-semibold rounded-3xl">Verified</span> : 'No'}</p>
                            <p className="flex flex-col">Last Login: <span>{moment(user?.lastLogin || null).format("MMMM Do YYYY, h:mm a")}</span></p>
                            <p>Created At: {moment(user?.createdAt || null).format("MMMM Do YYYY")}</p>
                        </motion.div>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-xl">
                {loading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-gray-500 mx-auto" />
                ) : (
                    <>
                        <motion.p className="text-xl font-bold tracking-wide text-navyLightest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>General</motion.p>
                        <motion.div className="flex items-center gap-3 bg-slate-100 p-4 rounded-lg shadow" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                            <div className="bg-navy/90 flex items-center text-white rounded-full p-2">
                                <BookUser size={25} fill="#0a192f" />
                            </div>
                            <p className="text-lg font-semibold">Bio</p>
                            <p>{user?.bio || "N/A"}</p>
                        </motion.div>
                        <motion.div className="flex items-center gap-3 bg-slate-100 p-4 rounded-lg shadow" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                            <p className="bg-navy/90 flex items-center text-white rounded-full p-2">{user?.gender === 'male' ? <Mars size={25} fill="#0a192f" /> : <Venus size={25} fill="#0a192f" />}</p>
                            <p className="text-lg font-semibold uppercase">{user?.gender || "N/A"}</p>
                        </motion.div>
                        <motion.div className="bg-slate-100 p-4 rounded-lg shadow space-y-3" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
                            <p className="text-lg font-semibold">Account Details</p>
                            <p>{user?.isVerified ? <span className="bg-green text-navy px-4 py-1 font-semibold rounded-3xl">Verified</span> : 'No'}</p>
                            <p className="flex flex-col">Last Login: <span>{moment(user?.lastLogin || null).format("MMMM Do YYYY, h:mm a")}</span></p>
                            <p>Created At: {moment(user?.createdAt || null).format("MMMM Do YYYY")}</p>
                        </motion.div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
