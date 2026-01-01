import { Character } from '../types'
import { SkillPenaltyTable, SMArr, dmgArr } from '../tables'

export const getSM = (c: Character) => SMArr[c.size] - 2

export const getGauntletPenalty = (c: Character) => c.hasGauntlets ? 3 : 0
export const getHelmPenalty = (c: Character) => c.hasHelm ? 3 : 0

export const skill = (c: Character, key: keyof Character['skills']) => c.skills[key as keyof Character['skills']] ?? 0