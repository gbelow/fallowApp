import { Character } from "../types"


export function getSTR(c: Character): number {
  return c.attributes.STR
}

export function getAGI(c: Character): number {
  return c.attributes.AGI - c.gearPen
}

export function getSTA(c: Character): number {
  return c.attributes.STA
}