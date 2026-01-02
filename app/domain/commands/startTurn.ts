import { Character } from '../types'

// set inTurnCharacter to this character
export function startTurn(
  characterId: string,
  characters: Record<string, Character>
): string {
  if (!characterId) {
    throw new Error('Character ID is required')
  }
  if (!characters[characterId]) {
    throw new Error(`Character with ID "${characterId}" not found`)
  }
  return characterId
}