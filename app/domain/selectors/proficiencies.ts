import {Character} from '../types'

export const getMelee = (c: Character) => c.proficiencies.melee
export const getRanged = (c: Character) => c.proficiencies.ranged
export const getDetection = (c: Character) => c.proficiencies.detection
export const getSpellcast = (c: Character) => c.proficiencies.spellcast