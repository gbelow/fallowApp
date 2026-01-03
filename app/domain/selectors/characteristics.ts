import { Character } from "../types"
import { getGearPenalties } from "./gear"
import { getDM } from "./helpers"


export function getSTR(c: Character): number {
  return c.characteristics.STR
}

export function getAGI(c: Character): number {
  return c.characteristics.AGI - getGearPenalties(c)
}

export function getSTA(c: Character): number {
  return c.characteristics.STA
}

export const getCON = (c: Character) => c.characteristics.CON
export const getINT = (c: Character) => c.characteristics.INT
export const getSPI = (c: Character) => c.characteristics.SPI
export const getDEX = (c: Character) => c.characteristics.DEX

export const getSize = (c: Character) => c.characteristics.size

export const getMelee = (c: Character) => c.characteristics.melee
export const getRanged = (c: Character) => c.characteristics.ranged
export const getDetection = (c: Character) => c.characteristics.detection
export const getSpellcast = (c: Character) => c.characteristics.spellcast
export const getConviction1 = (c: Character) => c.characteristics.conviction1
export const getConviction2 = (c: Character) => c.characteristics.conviction2

export const getRES = (c: Character) => Math.floor(c.characteristics.RES*getDM(c))
export const getTGH = (c: Character) => Math.floor(c.characteristics.TGH*getDM(c))
export const getINS = (c: Character) => Math.floor(c.characteristics.INS*getDM(c))


