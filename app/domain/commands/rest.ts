import { Character } from "../types"

export function restCharacter(c: Character): Character {
  if (!c.resources) {
    return c
  }

  const newSTA = c.resources.STA + Math.floor(c.attributes.STA / 4)
  const newAP = c.resources.AP - 4

  return {
    ...c,
    resources: {
      STA: newSTA,
      AP: newAP
    }
  }
}