"use client";

import { createContext, useRef } from "react";
import { AppState, createAppStore } from "./useAppStore";

export const AppStoreContext = createContext<ReturnType<typeof createAppStore> | null>(null);

export function AppStoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: Partial<AppState>;
}) {
  const storeRef = useRef<ReturnType<typeof createAppStore>>(null);

  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState);
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

