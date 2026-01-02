import { Character } from '../types'
import { SMArr } from '../tables'

export const getSM = (c: Character): number => {
  if (c.size < 0 || c.size >= SMArr.length) {
    throw new Error(`Invalid character size: ${c.size}. Size must be between 0 and ${SMArr.length - 1}.`)
  }
  return SMArr[c.size] - 2
}

export const getGauntletPenalty = (c: Character) => c.hasGauntlets ? 3 : 0
export const getHelmPenalty = (c: Character) => c.hasHelm ? 3 : 0

export const skill = (c: Character, key: keyof Character['skills']) => c.skills[key as keyof Character['skills']] ?? 0