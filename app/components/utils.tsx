
import { ArmorType, WeaponType, dmgArr } from "../types"

export function scaleArmor(armor: ArmorType, scale: number){
  const arm = {...armor, RES: Math.floor(armor.RES*dmgArr[scale-1]), TEN: Math.floor(armor.TEN*dmgArr[scale-1]), INS: Math.floor(armor.INS*dmgArr[scale-1]), prot:Math.floor( armor.prot*dmgArr[scale-1])}  
  return arm
}

export function scaleWeapon(weapon: WeaponType, scale: number){
    const weap = {...weapon, scale, attacks: weapon.attacks.map(el => ({...el, impact: Math.floor(el.impact*dmgArr[scale-1]), RES: Math.floor(el.RES*dmgArr[scale-1]), TEN: Math.floor(el.TEN*dmgArr[scale-1])}))}
    return weap
}

export function makeFullRoll(){
  let roll = Math.floor(Math.random() * 10)+1
    while(roll >= 10){
      const add = Math.floor(Math.random() * 6)+1
      roll +=add
      if(add != 6) break
    }
    while(roll <= 1){
      const sub = Math.floor(Math.random() * 6)+1
      roll -=sub
      if(sub != 6) break
    }
    return roll
}