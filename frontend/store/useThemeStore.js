import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "coffee",

  changeTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));
