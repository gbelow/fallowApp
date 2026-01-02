import { dmgArr, SMArr } from "../tables";
import { Armor, Character, Weapon } from "../types";

export function getGearPenalties(c: Character){
  const pen = 0 +
  c.armor.penalty + 
  Object.values(c.weapons).reduce((acc: number, weapon: Weapon) => acc + weapon.penalty, 0) + 
  Object.values(c.containers).reduce((acc, container) => acc + container.penalty, 0)

  return pen 
}

export function scaleArmor(armor: Armor, scale: number){
  const arm = {...armor, RES: Math.floor(armor.RES*dmgArr[scale-1]), TGH: Math.floor(armor.TGH*dmgArr[scale-1]), INS: Math.floor(armor.INS*dmgArr[scale-1]), prot:Math.floor( armor.prot*dmgArr[scale-1]), cover: armor.cover-SMArr[scale-1]}  
  return arm
}

export function scaleWeapon(weapon: Weapon, scale: number){
  const weap = {...weapon, scale, attacks: weapon.attacks.map(el => ({...el, impact: Math.floor(el.impact*dmgArr[scale-1]), RES: Math.floor(el.RES*dmgArr[scale-1]), TGH: Math.floor(el.TGH*dmgArr[scale-1])}))}
  return weap
}

export function getCharacterArmor(c: Character ){
  return c.armor
}

export function getCharacterWeapons(c: Character ){
  return c.weapons
}