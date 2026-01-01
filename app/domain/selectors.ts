import { Character } from "./types";




export const getAttribute = (
  character: Character,
  attr: keyof Character['attributes']
) => character.attributes[attr]



export function getClimb(character: Character): number {
  const { attributes, skills, size } = character

  const SM = size - 3
  const gauntletPenalty = character.hasGauntlets ? 1 : 0


  return (
    attributes.AGI - 10 +
    skills.climb -
    2 * SM -
    3 * gauntletPenalty -
    character.gearPen
  )
}

export function getSwim(character: Character): number {
  const { attributes, skills } = character

  return (
    attributes.AGI - 10 +
    skills.swim -
    character.gearPen
  )
}
