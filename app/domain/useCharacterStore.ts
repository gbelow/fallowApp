// stores/useCharacterStore.ts
import { create } from 'zustand'
import { Character } from './types'

type CharacterStore = {
  characters: Record<string, Character>
  activeCharacterId: string | null

  addCharacter: (character: Character) => void
  setActiveCharacter: (id: string) => void

  updateCharacter: (
    id: string,
    updater: (c: Character) => Character
  ) => void

  removeCharacter: (id: string) => void
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  characters: {},
  activeCharacterId: null,

  addCharacter: (character) =>
    set((s) => ({
      characters: {
        ...s.characters,
        [character.id]: character
      }
    })),

  setActiveCharacter: (id) =>
    set({ activeCharacterId: id }),

  updateCharacter: (id, updater) =>
    set((s) => {
      const current = s.characters[id]
      if (!current) return s

      const updated = updater(current)

      return {
        characters: {
          ...s.characters,
          [id]: updated
        }
      }
    }),

  removeCharacter: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.characters
      return { characters: rest }
    })
}))