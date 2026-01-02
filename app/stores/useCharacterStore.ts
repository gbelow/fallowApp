// stores/useCharacterStore.ts
import { create } from 'zustand'
import { Character } from '../domain/types'

type CharacterStore = {
  character:  Character | null

  loadCharacter: (character: Character) => void

  updateCharacter: (
    updater: (c: Character) => Character
  ) => void

  removeCharacter: (id: string) => void
}

export const useCharacterStore = create<CharacterStore>((set) => ({ 
  character: null,

  loadCharacter: (character) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {afflictions, injuries, hasActionSurge, fightName, survival, resources, ...char } = character
    set(() => ({
        character: char
      }
    ))
  },


  updateCharacter: ( updater) =>
    set((s) => {
      const current = s.character
      if (!current) return s
      const updated = updater(current)

      return {
        character: updated,
        }
      }
    ),
  
  removeCharacter: () =>
    set(() => {
      return { character: null }
    })
}))