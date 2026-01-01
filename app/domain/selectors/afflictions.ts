import { Character } from '../types'

export function getAfflictionPenalty(
  character: Character,
  skill: string
): number {
  if (!character.afflictions) return 0

  // 🔴 YOU define this later
  // Example shape:
  // dazzled → vision skills
  // exhausted → all physical skills
  // fear → social skills
  return 0
}