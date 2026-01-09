// stores/useCharacterStore.ts
import { create } from 'zustand'
import { CampaignCharacter, Character } from '../domain/types'
import { makeCharacterResources } from '../domain/factories'

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

function makeFightName(char: Character, characters: Record<string, Character>){
  let newName = char.name
  let count = 1
  while(Object.values(characters).find(el => el.fightName == newName) ){
    count++
    newName = char.name + count
  }
  return newName
}

export function addCharacterResources(char: Character, characters: Record<string, Character>) : CampaignCharacter {
  const fightName = makeFightName(char, characters)
  const id = crypto.randomUUID()
  const resources = makeCharacterResources(char)
  if(!isCampaignCharacter(char))  return { ...char, ...resources, id, fightName }
  return { ...char, fightName }
}

export function isCampaignCharacter(
  c: Character
): c is CampaignCharacter {
  return (
    c.id !== undefined &&
    c.injuries !== undefined &&
    c.afflictions !== undefined &&
    c.resources !== undefined &&
    c.fightName !== undefined &&
    c.hasActionSurge !== undefined
  );
}