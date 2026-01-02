import { create } from "zustand"


type GameTabs = 'edit' | 'play' 

interface NavState {
  selectedGameTab: GameTabs
  setSelectedGameTab: (mode: GameTabs) => void
}

export const useNavigationStore = create<NavState>((set) => ({
  selectedGameTab: 'edit',
  setSelectedGameTab: (selectedGameTab) => set({ selectedGameTab })
}))
