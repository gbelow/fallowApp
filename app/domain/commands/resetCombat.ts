// clear all characters from combat and reset round counter
export function resetCombat(): { characters: Record<string, never>; round: number } {
  return {
    characters: {},
    round: 0
  }
}