import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode } from "@/types/animation";

interface ThemeState {
  mode: ThemeMode;
  /** 1 = normal, 0.5 = zen mode (animations play at half speed) */
  animationSpeed: number;
}

const initialState: ThemeState = {
  mode: "dark",
  animationSpeed: 1,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      state.animationSpeed = action.payload === "zen" ? 0.5 : 1;
    },
    toggleZenMode(state) {
      if (state.mode === "zen") {
        state.mode = "dark";
        state.animationSpeed = 1;
      } else {
        state.mode = "zen";
        state.animationSpeed = 0.5;
      }
    },
  },
});

export const { setTheme, toggleZenMode } = themeSlice.actions;
export default themeSlice.reducer;
