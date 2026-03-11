import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CursorVariant } from "@/types/animation";

interface UIState {
  isLoading: boolean;
  cursorVariant: CursorVariant;
  zenModeUnlocked: boolean;
  /** Unlocked by clicking footer avatar 7 times */
  easterEggUnlocked: boolean;
  /** Skip intro animation on return visits */
  hasVisited: boolean;
}

const initialState: UIState = {
  isLoading: false,
  cursorVariant: "default",
  zenModeUnlocked: false,
  easterEggUnlocked: false,
  hasVisited: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCursorVariant(state, action: PayloadAction<CursorVariant>) {
      state.cursorVariant = action.payload;
    },
    unlockZenMode(state) {
      state.zenModeUnlocked = true;
    },
    unlockEasterEgg(state) {
      state.easterEggUnlocked = true;
    },
    markVisited(state) {
      state.hasVisited = true;
    },
  },
});

export const {
  setLoading,
  setCursorVariant,
  unlockZenMode,
  unlockEasterEgg,
  markVisited,
} = uiSlice.actions;
export default uiSlice.reducer;
