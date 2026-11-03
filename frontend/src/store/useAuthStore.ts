import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import type { IUser } from "../interfaces/index.ts";
import toast from "react-hot-toast";
import { getErrorMessage } from "../lib/utils.ts";
import { io, Socket } from "socket.io-client";


interface IFormData {
  fullName?: string,
  email: string,
  password: string
}


interface useAuthState {
  authUser: IUser | null,
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isUpdatingProfile: boolean,
  isCheckingAuth: boolean,
  onlineUsers: string[],
  socket: null | Socket,

  checkAuth: () => void,
  signUp: (data: IFormData) => void,
  logout: () => void,
  login: (data: IFormData) => void,
  updateProfile: (data: FormData) => void,
  connectSocket: () => void,
  disconnectSocket: () => void,
};


const BASEURL = "http://localhost:5001";


export const useAuthStore = create<useAuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
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
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: () => {
    try {
      axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      console.log(res.data);
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket: currentSocket } = get();
    if (!authUser || currentSocket?.connected) return;
    const socket = io(BASEURL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  }
}));