import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SectionId } from "@/lib/constants";

interface NavigationState {
  activeSection: SectionId;
  /** 0 → 1, overall page scroll progress */
  scrollProgress: number;
  isMenuOpen: boolean;
}

const initialState: NavigationState = {
  activeSection: "hero",
  scrollProgress: 0,
  isMenuOpen: false,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<SectionId>) {
      state.activeSection = action.payload;
    },
    setScrollProgress(state, action: PayloadAction<number>) {
      state.scrollProgress = Math.min(1, Math.max(0, action.payload));
    },
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu(state) {
      state.isMenuOpen = false;
    },
  },
});

export const { setActiveSection, setScrollProgress, toggleMenu, closeMenu } =
  navigationSlice.actions;
export default navigationSlice.reducer;
