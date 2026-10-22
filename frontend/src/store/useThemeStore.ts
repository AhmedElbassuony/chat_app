import { create } from "zustand";

interface useThemeState {
  theme: string,
  setTheme: (theme: string) => void
};


const useThemeStore = create<useThemeState>((set) => ({
  theme: localStorage.getItem("theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme: theme });
  }
}));


export default useThemeStore;