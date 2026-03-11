"use client";

import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

/**
 * Typed hooks — import these instead of the plain useSelector/useDispatch.
 *
 * Usage:
 *   import { useAppSelector, useAppDispatch } from "@/store/hooks";
 *   const theme = useAppSelector((s) => s.theme.mode);
 */
