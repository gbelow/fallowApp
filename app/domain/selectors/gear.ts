import { dmgArr, SMArr } from "../tables";
import { Armor, Character, Weapon } from "../types";

export function getGearPenalties(c: Character){
  const pen = 0 +
  c.armor.penalty + 
  Object.values(c.weapons).reduce((acc: number, weapon: Weapon) => acc + weapon.penalty, 0) + 
  Object.values(c.containers).reduce((acc, container) => acc + container.penalty, 0)

  return pen 
}

export function scaleArmor(armor: Armor, scale: number): Armor {
  // Validate scale is within bounds (1-7, where scale-1 maps to array indices 0-6)
  const clampedScale = Math.max(1, Math.min(7, scale))
  const scaleIndex = clampedScale - 1
  
  if (scaleIndex < 0 || scaleIndex >= dmgArr.length || scaleIndex >= SMArr.length) {
    throw new Error(`Invalid scale value: ${scale}. Scale must be between 1 and ${dmgArr.length}.`)
  }

  const arm = {
    ...armor,
    RES: Math.floor(armor.RES * dmgArr[scaleIndex]),
    TGH: Math.floor(armor.TGH * dmgArr[scaleIndex]),
    INS: Math.floor(armor.INS * dmgArr[scaleIndex]),
    prot: Math.floor(armor.prot * dmgArr[scaleIndex]),
    cover: armor.cover - SMArr[scaleIndex]
  }
  return arm
}

export function scaleWeapon(weapon: Weapon, scale: number): Weapon {
  // Validate scale is within bounds (1-7, where scale-1 maps to array indices 0-6)
  const clampedScale = Math.max(1, Math.min(7, scale))
  const scaleIndex = clampedScale - 1
  
  if (scaleIndex < 0 || scaleIndex >= dmgArr.length) {
    throw new Error(`Invalid scale value: ${scale}. Scale must be between 1 and ${dmgArr.length}.`)
  }

  const weap = {
    ...weapon,
    scale: clampedScale,
    attacks: weapon.attacks.map(el => ({
      ...el,
      impact: Math.floor(el.impact * dmgArr[scaleIndex]),
      RES: Math.floor(el.RES * dmgArr[scaleIndex]),
      TGH: Math.floor(el.TGH * dmgArr[scaleIndex])
    }))
  }
  return weap
}

export function getCharacterArmor(c: Character ){
  return c.armor
}

export function getCharacterWeapons(c: Character ){
  return c.weapons
}