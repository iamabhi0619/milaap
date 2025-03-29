import { v5 as uuidv5 } from "uuid";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { UserState } from "@/types/types";

const NAMESPACE = "550e8400-e29b-41d4-a716-446655440000";

function convertMongoIdToUUID(mongoId: string): string {
  return uuidv5(mongoId, NAMESPACE);
}

export const useUserStore = create<UserState>((set) => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  async function fetchUser() {
    if (!token) {
      console.warn("No token found, skipping fetchUser.");
      return;
    }

    try {
      // Decode JWT token without verifying
      const decoded = jwt.decode(token);
      if (!decoded || typeof decoded !== "object" || !decoded._id) {
        console.error("Invalid token, logging out...");
        set({ user: null, isAuthenticated: false });
        return;
      }

      const userId = convertMongoIdToUUID(decoded._id);

      // Fetch user from Supabase
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, name, avatar, blocked")
        .eq("id", userId)
        .single();

      if (error || !user) {
        console.error("User not found in Supabase:", error?.message);
        set({ user: null, isAuthenticated: false });
        return;
      }

      set({
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "Unknown User",
          token: token as string,
          avatar: user.avatar || "/default-avatar.png",
          blocked: user.blocked || [],
        },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, isAuthenticated: false });
    }
  }

  if (token) {
    fetchUser().catch((err) => console.error("Error in fetchUser:", err));
  }

  return {
    user: null,
    isAuthenticated: false,

    login: async (email, password) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Invalid email or password");

        const { token, user } = await response.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }

        const userId = convertMongoIdToUUID(user._id);

        // Check if user exists in Supabase
        const { data, error } = await supabase.from("users").select("id").eq("id", userId).single();

        if (error || !data) {
          // Insert new user if not exists
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: userId,
              name: user.name,
              email: user.email,
              avatar: user.avatar || "",
              blocked: [],
            },
          ]);
          if (insertError) {
            console.error("Failed to insert user in Supabase:", insertError.message);
            throw new Error("User registration failed in Supabase");
          }
        }

        set({
          user: {
            id: userId,
            email: user.email,
            name: user.name,
            token,
            avatar: user.avatar,
            blocked: [],
          },
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Login failed:", error);
      }
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      set({ user: null, isAuthenticated: false });
    },

    fetchUser,
    convertMongoIdToUUID,
  };
});
