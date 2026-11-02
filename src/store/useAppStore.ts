import { create } from 'zustand';

interface AppState {
  scrollProgress: number;
  isHolding: boolean;       // For the click-and-hold portal mechanic
  activeSection: number;
  audioMuted: boolean;
  isLoaded: boolean;
  setScrollProgress: (val: number) => void;
  setIsHolding: (val: boolean) => void;
  setActiveSection: (val: number) => void;
  toggleAudio: () => void;
  setIsLoaded: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  isHolding: false,
  activeSection: 0,
  audioMuted: false,
  isLoaded: false,
  setScrollProgress: (val) => set({ scrollProgress: val }),
  setIsHolding: (val) => set({ isHolding: val }),
  setActiveSection: (val) => set({ activeSection: val }),
  toggleAudio: () => set((state) => ({ audioMuted: !state.audioMuted })),
  setIsLoaded: (val) => set({ isLoaded: val }),
}));
