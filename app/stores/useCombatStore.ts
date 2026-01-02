// stores/useCharacterStore.ts
import { create } from 'zustand'
import { Character } from '../domain/types'
import { createCharacterResources } from '../domain/factories'

type CharacterStore = {
  characters: Record<string, Character>
  activeCharacterId: string | null
  round: number
  
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
  round: 0,

  addCharacter: (character) =>
    set((s) => {
      const id = crypto.randomUUID()
      const char = !character.resources ? addCharacterResources(character) : character
      return({
        characters: {
          ...s.characters,
          [id]: {...char, id, fightName: makeFightName(char, s.characters)}
        }
      })
    }),

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = s.characters
      return { characters: rest }
    })
}))

function makeFightName(char: Character, characters: Record<string, Character>){
  let newName = char.name
  let count = 1
  while(characters[newName] != undefined){
    count++
    newName = char.name + count
  }
  return newName
}

function addCharacterResources(char: Character): Character {
  const resources = createCharacterResources(char)
  return { ...char, ...resources }
}