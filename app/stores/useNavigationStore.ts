import { create } from "zustand"


type NavMode = 'create' | 'run' 

interface NavState {
  mode: NavMode
  setMode: (mode: NavMode) => void
}

export const useNavigationStore = create<NavState>((set) => ({
  mode: 'create',
  setMode: (mode) => set({ mode })
}))
