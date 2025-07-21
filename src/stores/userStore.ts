import { verifyJwtAction } from "@/lib/actions/auth";
import api from "@/lib/api";

import { supabase } from "@/lib/supabase";
import { UserStore } from "@/lib/types/stores";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create<UserStore>((set) => ({
  id: null,
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string, isRemember: boolean) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      toast.success(response.data.message || "Login successful");
      if (token) {
        if (isRemember && typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      }
      set({ token: token });
      const userId = user._id;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userId", userId)
        .single();
      if (data) {
        set({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            avatar: data.avatar || "",
            userId: data.userId,
            gender: data.gender,
            status: data.status || "online",
            blocked: user.blocked || [],
            created_at: data.created_at,
            updated_at: data.updated_at,
          },
          isAuthenticated: true,
        });
        return true;
      }
      if (error?.code == "PGRST116") {
        const insertRes = await supabase.from("users").insert({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
          gender: user.gender || "",
          status: "online",
          blocked: user.blocked || [],
        });
        if (insertRes.error) {
          if (process.env.NODE_ENV === "development")
            console.error("Error inserting user:", insertRes);
          toast.error("Failed to create user in Supabase");
          return false;
        }
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("userId", user._id)
          .single();
        if (error) {
          if (process.env.NODE_ENV === "development") console.error("Error fetching user:", error);
        }
        set({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            avatar: data.avatar || "",
            userId: data.userId,
            gender: data.gender,
            status: data.status || "online",
            blocked: user.blocked || [],
            created_at: data.created_at,
            updated_at: data.updated_at,
          },
          isAuthenticated: true,
        });
        toast.info("Welcome to Milaap! It's your place");
      }
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred during login");
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },
  register: async (email: string, password: string, name: string, gender: string) => {
    try {
      set({ loading: true });
      const response = await api.post("/auth/signup", { email, password, name, gender });
      toast.success(response.data.message || "Registration successful");
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Error during registration:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else {
        toast.error("An unexpected error occurred during registration");
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true });
    localStorage.clear();
    set({ id: null, user: null, token: null, isAuthenticated: false, loading: false });
  },
  forgetPassword: async (email: string) => {
    try {
      set({ loading: true });
      const response = await api.post("/auth/forget-password", { email });
      toast.success(response.data.message || "Password reset link sent to your email");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to send password reset link");
      } else {
        toast.error("An unexpected error occurred while sending password reset link");
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    try {
      set({ loading: true });
      const tokenStr = localStorage.getItem("token");
      if (!tokenStr) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      let token;
      try {
        // const response = await axios.get("/api/verify", {
        //   headers: {
        //     Authorization: `Bearer ${tokenStr}`,
        //   },
        // });
        // console.log(response.data.decoded);
        const data = await verifyJwtAction(tokenStr);
        console.log(data);
        token = data._id;
      } catch {
        set({ user: null, isAuthenticated: false });
        toast.error("Invalid or expired token. Please log in again.");
        localStorage.removeItem("token");
        return;
      }
      const userId = token;
      if (!userId) {
        set({ user: null, isAuthenticated: false });
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userId", userId)
        .single();

      if (error || !data) {
        set({ user: null, isAuthenticated: false });
        toast.error("User not found. Please log in again.");
        return;
      }
      set({
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || "",
          userId: data.userId,
          gender: data.gender,
          status: data.status || "online",
          blocked: data.blocked || [],
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
        isAuthenticated: true,
      });
      toast.success("Welcome back..!");
    } catch {
      set({ user: null, isAuthenticated: false });
      toast.error("Failed to fetch user. Please log in again.");
    } finally {
      set({ loading: false });
    }
  },
}));
