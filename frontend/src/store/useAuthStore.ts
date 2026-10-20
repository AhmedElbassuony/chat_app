import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import type { IUser } from "../interfaces/index.ts";
import toast from "react-hot-toast";

interface IFormData {
  fullName: string,
  email: string,
  password: string
}


interface useAuthState {
  authUser: IUser | null,
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isUpdatingProfile: boolean,

  isCheckingAuth: boolean,

  checkAuth: () => void,
  signUp: (data: IFormData) => void,
  logout: () => void

};



export const useAuthStore = create<useAuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data })
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: () => {
    try {
      axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
}));