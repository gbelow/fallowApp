import { Character } from "../types";

export function getGearPenalties(c: Character){
  const pen = c.armor.penalty + c.weapons.reduce((acc, weapon) => acc + weapon.range, 0)
  return pen 
}