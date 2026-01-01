import { Character } from '../types'
import { getSM, getGauntletPenalty, getHelmPenalty, skill } from './helpers'
import { getMelee, getRanged, getDetection, getSpellcast } from './proficiencies'
import { getAfflictionPenalty } from './afflictions'

export function getStrike(c: Character) {
  return getMelee(c) + skill(c, 'strike') - getAfflictionPenalty(c, 'strike')
}

export function getAccuracy(c: Character) {
  return (
    getRanged(c) -
    3 * getGauntletPenalty(c) +
    skill(c, 'accuracy') -
    getAfflictionPenalty(c, 'accuracy')
  )
}

export function getDefend(c: Character) {
  return getMelee(c) + skill(c, 'defend') - getAfflictionPenalty(c, 'defend')
}

export function getReflex(c: Character) {
  const SM = getSM(c)
  return (
    getDetection(c) +
    getRanged(c) -
    3 * getHelmPenalty(c) -
    SM +
    skill(c, 'reflex') -
    getAfflictionPenalty(c, 'reflex')
  )
}

export function getGrapple(c: Character) {
  const SM = getSM(c)
  return (
    c.attributes.STR -
    10 +
    5 * SM +
    skill(c, 'grapple') -
    getAfflictionPenalty(c, 'grapple')
  )
}

export function getCunning(c: Character) {
  return (
    getDetection(c) -
    3 * getHelmPenalty(c) +
    skill(c, 'cunning') -
    getAfflictionPenalty(c, 'cunning')
  )
}

export function getSD(c: Character) {
  const SM = getSM(c)
  return -2 - SM + skill(c, 'SD') - getAfflictionPenalty(c, 'SD')
}

// selectors/skills/physical.ts

export function getBalance(c: Character) {
  return (
    c.attributes.AGI -
    10 +
    skill(c, 'balance') -
    getAfflictionPenalty(c, 'balance')
  )
}

export function getClimb(c: Character) {
  const SM = getSM(c)
  return (
    c.attributes.AGI -
    10 +
    skill(c, 'climb') -
    2 * SM -
    3 * getGauntletPenalty(c) -
    c.gearPen -
    getAfflictionPenalty(c, 'climb')
  )
}

export function getSwim(c: Character) {
  return (
    c.attributes.AGI -
    10 +
    skill(c, 'swim') -
    c.gearPen -
    3 * c.hasHelm -
    getAfflictionPenalty(c, 'swim')
  )
}

export function getStrength(c: Character) {
  const SM = getSM(c)
  return (
    c.attributes.STR -
    10 +
    5 * SM +
    skill(c, 'strength') -
    getAfflictionPenalty(c, 'strength')
  )
}

export function getSneak(c: Character) {
  const SM = getSM(c)
  return (
    c.attributes.AGI -
    10 +
    skill(c, 'sneak') -
    3 * SM -
    c.gearPen -
    getAfflictionPenalty(c, 'sneak')
  )
}

export function getPrestidigitation(c: Character) {
  return (
    c.talents.DEX -
    3 * c.hasGauntlets +
    skill(c, 'prestidigitation') -
    getAfflictionPenalty(c, 'prestidigitation')
  )
}

export function getHealth(c: Character) {
  return c.talents.CON + skill(c, 'health')
}



export function getKnowledge(c: Character) {
  return (
    2 * c.talents.INT +
    skill(c, 'knowledge') -
    getAfflictionPenalty(c, 'knowledge')
  )
}

export function getExplore(c: Character) {
  return (
    getDetection(c) +
    skill(c, 'explore') -
    getAfflictionPenalty(c, 'explore')
  )
}

export function getWill(c: Character) {
  return skill(c, 'will') - getAfflictionPenalty(c, 'will')
}

export function getCharm(c: Character) {
  return skill(c, 'charm') - getAfflictionPenalty(c, 'charm')
}

export function getStress(c: Character) {
  return skill(c, 'stress')
}

export function getDevotion(c: Character) {
  return c.talents.SPI + skill(c, 'devotion')
}

const magic =
  (school: string) =>
  (c: Character) =>
    getSpellcast(c) +
    skill(c, school as keyof Character['skills']) -
    getAfflictionPenalty(c, school as keyof Character['skills'])

export const getCombustion = magic('combustion')
export const getEletromag = magic('eletromag')
export const getRadiation = magic('radiation')
export const getEnthropy = magic('enthropy')
export const getBiomancy = magic('biomancy')
export const getTelepathy = magic('telepathy')
export const getAnimancy = magic('animancy')