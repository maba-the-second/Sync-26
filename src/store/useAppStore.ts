import { create } from 'zustand';

export type PageId =
  | 'home'
  | 'registrations'
  | 'odyssey'
  | 'aspect'
  | 'about';

interface AppState {
  activePage: PageId;
  scrollProgress: number;
  isHolding: boolean;       // For the click-and-hold portal mechanic
  activeSection: number;
  audioMuted: boolean;
  isLoaded: boolean;
  setActivePage: (page: PageId) => void;
  setScrollProgress: (val: number) => void;
  setIsHolding: (val: boolean) => void;
  setActiveSection: (val: number) => void;
  toggleAudio: () => void;
  setIsLoaded: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePage: 'home',
  scrollProgress: 0,
  isHolding: false,
  activeSection: 0,
  audioMuted: true,
  isLoaded: false,
  setActivePage: (page) => set({ activePage: page, scrollProgress: 0, activeSection: 0 }),
  setScrollProgress: (val) => set({ scrollProgress: val }),
  setIsHolding: (val) => set({ isHolding: val }),
  setActiveSection: (val) => set({ activeSection: val }),
  toggleAudio: () => set((state) => ({ audioMuted: !state.audioMuted })),
  setIsLoaded: (val) => set({ isLoaded: val }),
}));
