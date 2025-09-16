
import { ArmorType, WeaponType, dmgArr } from "../types"

export function scaleArmor(armor: ArmorType, scale: number){
  const arm = {...armor, RES: Math.floor(armor.RES*dmgArr[scale-1]), TEN: Math.floor(armor.TEN*dmgArr[scale-1]), INS: Math.floor(armor.INS*dmgArr[scale-1]), prot:Math.floor( armor.prot*dmgArr[scale-1])}  
  return arm
}

export function scaleWeapon(weapon: WeaponType, scale: number){
    const weap = {...weapon, scale, attacks: weapon.attacks.map(el => ({...el, impact: Math.floor(el.impact*dmgArr[scale-1]), RES: Math.floor(el.RES*dmgArr[scale-1]), TEN: Math.floor(el.TEN*dmgArr[scale-1])}))}
    return weap
}