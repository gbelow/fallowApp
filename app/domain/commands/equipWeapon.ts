import { Character, Weapon } from '../types'

export function equipWeapon(
  character: Character,
  weapon: Weapon
): Character {

  return {
    ...character,
    weapons: {
      ...character.weapons,
      [weapon.name]: weapon
    }
  }
}