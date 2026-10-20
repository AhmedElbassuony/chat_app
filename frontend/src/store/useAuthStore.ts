import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import type { IUser } from "../interfaces/index.ts";


interface useAuthState {
  authUser: IUser | null,
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isUpdatingProfile: boolean,

  isCheckingAuth: boolean,

  checkAuth: () => void
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
  }
}));