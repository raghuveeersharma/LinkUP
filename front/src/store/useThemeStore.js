import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("LinkUpTheme") || "forest",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("LinkUpTheme", theme);
  },
}));
