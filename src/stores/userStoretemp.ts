import { v5 as uuidv5 } from "uuid";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { User, UserState } from "@/types/types";
import api from "@/lib/api";
import { toast } from "sonner";
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
      const decoded = jwt.decode(token);
      if (!decoded || typeof decoded !== "object" || !decoded._id) {
        toast.error("Invalid token format");
        console.error("Invalid token, logging out...");
        set({ user: null, isAuthenticated: false });
        return;
      }
      const userId = convertMongoIdToUUID(decoded._id);
      // Step 1: Fetch latest user data from API
      const response = await api.get(`/user/me`);
      if (!response.data.success) {
        console.error("Failed to fetch user from API:", response.statusText);
        throw new Error("API fetch failed");
      }
      const latestUser = await response.data;
      // Step 2: Fetch user from Supabase
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, name, avatar, blocked")
        .eq("id", userId)
        .single();
      if (error || !user) {
        console.warn("User not found in Supabase, inserting new user...");
        await supabase.from("users").insert([
          {
            id: userId,
            name: latestUser.name,
            email: latestUser.email,
            avatar: latestUser.avatar || "",
            blocked: latestUser.blocked || [],
          },
        ]);
      } else {
        // Step 3: Update Supabase if there's a difference
        const updates: Partial<User> = {};
        if (user.name !== latestUser.name) updates.name = latestUser.name;
        if (user.email !== latestUser.email) updates.email = latestUser.email;
        if (user.avatar !== latestUser.avatar) updates.avatar = latestUser.avatar;
        if (JSON.stringify(user.blocked) !== JSON.stringify(latestUser.blocked))
          updates.blocked = latestUser.blocked;
        if (Object.keys(updates).length > 0) {
          await supabase.from("users").update(updates).eq("id", userId);
        }
      }
      // Step 4: Update Zustand state with the latest user data
      set({
        user: {
          id: userId,
          email: latestUser.email,
          name: latestUser.name || "Unknown User",
          token: token as string,
          avatar: latestUser.avatar || "/default-avatar.png",
          blocked: latestUser.blocked || [],
          created_at: latestUser.created_at || new Date().toISOString(),
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
    login: async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        if (!email || !password) {
          toast.error("Email and password are required");
          return;
        }
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;
        toast.success(response.data.message || "Login successful");
        if (rememberMe && typeof window !== "undefined") {
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
              blocked: user.blocked || [],
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
            blocked: user.blocked || [],
            created_at: user.created_at || new Date().toISOString(),
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
