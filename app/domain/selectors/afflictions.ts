import { Character } from '../types'
import { SkillPenaltyTable, afflictions as afflictionDefinitions } from '../tables'

export function getAfflictionPenalty(
  character: Character,
  skill: keyof Character['skills']
): number {
  if (!character.afflictions || character.afflictions.length === 0) {
    return 0
  }

  let totalPenalty = 0

  const injuryPenalty = getInjuryPenalty(character)

  for (const afflictionName of character.afflictions) {
    const afflictionDef = afflictionDefinitions[afflictionName]
    if (!afflictionDef || !afflictionDef.isActive) {
      continue
    }

    // Check each penalty category that affects this skill
    for (const [category, affectedSkills] of Object.entries(SkillPenaltyTable)) {
      if (affectedSkills.includes(skill)) {
        const penaltyValue = category != 'injury' ? getPenaltyForCategory(afflictionDef, category as keyof typeof SkillPenaltyTable) : injuryPenalty
        if (penaltyValue > 0) {
          totalPenalty += penaltyValue
        }
      }
    }
  }

  return totalPenalty
}

function getPenaltyForCategory(
  affliction: { mobility?: number; vision?: number; mental?: number; health?: number; [key: string]: unknown },
  category: keyof typeof SkillPenaltyTable
): number {
  switch (category) {
    case 'mobility':
      return affliction.mobility ?? 0
    case 'vision':
      return affliction.vision ?? 0
    case 'mental':
      return affliction.mental ?? 0
    case 'health':
      return affliction.health ?? 0
    default:
      return 0
  }
}

export function getInjuryPenalty(c : Character){
  if(!c.injuries) return 0  
    const injPen = Math.floor(c.injuries.light.filter(el => el != 0).length/2) + 
    c.injuries.serious.filter(el => el != 0).length + 
    2*c.injuries.deadly.filter(el => el != 0).length
    return injPen
  
}