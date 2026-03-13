import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      setDarkMode: (value) => {
        set({ isDarkMode: value });
      },
      
      initTheme: () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const stored = get().isDarkMode;
        if (stored === undefined) {
          set({ isDarkMode: prefersDark });
        }
      },
    }),
    {
      name: 'fixkart-theme',
    }
  )
);
