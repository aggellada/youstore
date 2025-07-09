import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios.js";

export const useAuthStore = create((set, get) => ({
  authuser: null,
  isLoggingIn: false,
  isLoggingOut: false,
  isSigningUp: false,

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Successfully created an account");
    } catch (error) {
      console.log("Error in sign in store", error);
      toast.error("Error creating an account");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Successfully logged in");
    } catch (error) {
      console.log("Error in login store", error);
      toast.error("Error loggin in");
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Successfully logged out");
    } catch (error) {
      console.log("Error in logout store", error);
      toast.error("Error logging out");
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
