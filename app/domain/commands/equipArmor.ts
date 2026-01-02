import { Character, Armor } from '../types'

export function equipArmor(
  character: Character,
  armor: Armor
): Character {
  if (!armor) {
    throw new Error('Armor is required')
  }
  if (!armor.name || typeof armor.name !== 'string') {
    throw new Error('Armor must have a valid name')
  }
  if (typeof armor.type !== 'string' || !['light', 'medium', 'heavy'].includes(armor.type)) {
    throw new Error('Armor must have a valid type (light, medium, or heavy)')
  }
  if (typeof armor.RES !== 'number' || typeof armor.TGH !== 'number' || typeof armor.INS !== 'number') {
    throw new Error('Armor must have valid RES, TGH, and INS values')
  }

  return { ...character, armor }
}