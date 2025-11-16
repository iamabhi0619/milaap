import api, { setAccessToken } from "@/lib/api";

import { supabase } from "@/lib/supabase";
import { APIUser } from "@/types/user";
import { UserStore } from "@/types/user-store";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

const initUser = async ({ user }: { user: APIUser }) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', user._id).single();
  if (error) {
    if (error.code === 'PGRST116') {
      const newUser = await supabase.from('users').insert({
        id: user._id,
        username: user.userId,
        name: user.name,
        avatar: user.avatar || null,
        status: 'online',
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      return newUser.data;
    } else {
      console.error("Error fetching user:", error);
      return null;
    }
  }
  const { data: updatedData, error: updateError } = await supabase.from('users').update({
    username: user.userId,
    avatar: user.avatar || null,
    name: user.name,
    updated_at: new Date().toISOString(),
    status: 'online',
    last_seen: new Date().toISOString(),
  }).eq('id', user._id).single();
  if (updateError) {
    console.error("Error updating user:", updateError);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ...(data as any), ...(updatedData as any) };
};

export const useUserStore = create<UserStore>((set) => ({
  id: null,
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string, isRemember: boolean) => {
    try {
      set({ loading: true })
      const response = await api.post("/auth/v1/login", { email, password, isRemember });
      const { token, user } = response.data;
      toast.success(response.data.message || "Login successful");
      set({ token: token });
      setAccessToken(token);
      const userData = await initUser({ user });
      if (userData) {
        set({ user: userData, isAuthenticated: true });
        return true;
      } else {
        set({ user: null, isAuthenticated: false });
        toast.error("Failed to initialize user data");
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
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
      // const tokenStr = localStorage.getItem("token");
      // if (!tokenStr) {
      //   set({ user: null, isAuthenticated: false });
      //   return;
      // }
      const { data: userData } = await api.get("/user/me");
      if (!userData) {
        set({ user: null, isAuthenticated: false });
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userData.user._id)
        .single();

      if (error || !data) {
        set({ user: null, isAuthenticated: false });
        toast.error("User not found. Please log in again.");
        return;
      }
      const updatedData = await initUser({ user: userData.user });
      set({ user: updatedData, isAuthenticated: true });
      toast.success(`Welcome back ${updatedData.name || "user"}!`);
    } catch {
      set({ user: null, isAuthenticated: false });
      toast.error("Failed to fetch user. Please log in again.");
    } finally {
      set({ loading: false });
    }
  },
}));
