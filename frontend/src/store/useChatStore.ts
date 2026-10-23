import { create } from "zustand";
import type { IMessage, IUser } from "../interfaces";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../lib/utils.ts";

interface UseChatState {
  users: IUser[],
  messages: IMessage[],
  selectedUser: IUser | null,
  isUsersLoading: boolean,
  isMessagesLoading: boolean,

  getUsers: () => void,
  getMessages: (userId: string) => void,
  setSelectedUser: (selectedUser: IUser | null) => void,
  sendMessage: (data: IMessage) => void,
};


const useChatStore = create<UseChatState>((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => { set({ selectedUser: selectedUser }) },
  sendMessage: async (data: IMessage) => {
    const { messages, selectedUser } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }
}));

export default useChatStore;