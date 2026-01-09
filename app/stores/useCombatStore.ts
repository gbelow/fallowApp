// stores/useCharacterStore.ts
import { create } from 'zustand'
import { CampaignCharacter, Character } from '../domain/types'
import { addCharacterResources } from '../domain/utils'

export type CombatStore = {
  characters: Record<string, CampaignCharacter>
  activeCharacterId: string | null
  round: number
  inTurnCharacter: string
  
  addCharacter: (character: Character | CampaignCharacter) => void
  setActiveCharacter: (id: string) => void
  getActiveCharacter: (id: string | void) => CampaignCharacter | null

  updateActiveCharacter: (
    updater: (c: CampaignCharacter) => CampaignCharacter
  ) => void

  removeCharacter: (id: string) => void

  updateCombatState: (updater: (state: CombatStore) => CombatStore) => void
}

export const useCombatStore = create<CombatStore>((set, get) => ({ 
  characters: {},
  activeCharacterId: null,
  round: 0,
  inTurnCharacter: '',

  updateCombatState: (updater) => {
    set( updater)
  },

  addCharacter: (character) =>
    set((s) => {
      const char = addCharacterResources(character, s.characters)
      return({
        characters: {
          ...s.characters,
          [String(char.id)]: char
        }
      })
    }),

  setActiveCharacter: (id) => {
    set({ activeCharacterId: id })
  },

  getActiveCharacter: () => {
    const {characters, activeCharacterId} = get()
    if(!activeCharacterId) return null
    return characters[activeCharacterId]
  },

  updateActiveCharacter: (updater) =>
    set((s) => {
      const current = s.getActiveCharacter()      
      if (!current || !current.id) return s

      const updated = updater(current)

      return {
        characters: {
          ...s.characters,
          [current.id]: updated
        }
      }
    }),

  removeCharacter: (id) =>
    set((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = s.characters
      return { characters: rest }
    })
}))
