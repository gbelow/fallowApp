import { Character, Armor } from '../types'

export function equipArmor(
  character: Character,
  armor: Armor
): Character {

  return { ...character, armor }
}