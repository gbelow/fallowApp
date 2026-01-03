import { Character } from '../types'
import { dmgArr, SMArr } from '../tables'

export const getSM = (c: Character): number => {
  const size = c.characteristics.size
  if (size < 1 || size >= SMArr.length) {
    throw new Error(`Invalid character size: ${size}. Size must be between 0 and ${SMArr.length}.`)
  }
  return SMArr[size-1]
}

export const getDM = (c: Character): number => {
  const size = c.characteristics.size
  if (size < 1 || size >= SMArr.length) {
    throw new Error(`Invalid character size: ${size}. Size must be between 0 and ${SMArr.length}.`)
  }
  return dmgArr[size-1]
}

export const getGauntletPenalty = (c: Character) => c.hasGauntlets ? 3 : 0
export const getHelmPenalty = (c: Character) => c.hasHelm ? 3 : 0

export const skill = (c: Character, key: keyof Character['skills']) => c.skills[key as keyof Character['skills']] ?? 0

