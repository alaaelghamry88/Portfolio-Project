import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import navigationReducer from "./slices/navigationSlice";
import projectsReducer from "./slices/projectsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    navigation: navigationReducer,
    projects: projectsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
