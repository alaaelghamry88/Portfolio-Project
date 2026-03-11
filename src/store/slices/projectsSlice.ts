import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/types/project";

interface ProjectsState {
  items: Project[];
  activeFilter: string | null;
  /** Slug of the project currently being viewed / transitioning to */
  activeProject: string | null;
}

const initialState: ProjectsState = {
  items: [],
  activeFilter: null,
  activeProject: null,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.items = action.payload;
    },
    setFilter(state, action: PayloadAction<string | null>) {
      state.activeFilter = action.payload;
    },
    setActiveProject(state, action: PayloadAction<string | null>) {
      state.activeProject = action.payload;
    },
  },
});

export const { setProjects, setFilter, setActiveProject } =
  projectsSlice.actions;
export default projectsSlice.reducer;
