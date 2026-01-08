import { createStore } from "zustand/vanilla";
import { getBasicCharList, JsonObject } from "../actions";
import { useContext } from "react";
import { AppStoreContext } from "./appStoreProvider";
import { useStore } from "zustand";

type GameTabs = 'edit' | 'play' 

export interface AppState {
  selectedGameTab: GameTabs
  setSelectedGameTab: (mode: GameTabs) => void
  baseCharacterList: JsonObject
  updateBaseCharacterList: () => void
  
}

export const createAppStore = (initialState: Partial<AppState>) =>
  createStore<AppState>((set) => ({
    selectedGameTab: 'edit',
    setSelectedGameTab: (selectedGameTab) => set({ selectedGameTab }),

    baseCharacterList: initialState.baseCharacterList || {},
    updateBaseCharacterList: async () => {
      try {
        const baseCharacterList = await getBasicCharList()
        set({ baseCharacterList })
      }catch(err){
        console.log(err)
      }
    },
  })
);

export function useAppStore<T>(selector: (state: AppState) => T) {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error("Missing AppStoreProvider");
  return useStore(store, selector);
}