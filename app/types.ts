import weapons from './weapons.json'
import baseCharacter from './baseCharacter.json'
import baseArmor from './baseArmor.json'
import baseWeapon from './baseWeapon.json'



export const MHArr = [-2,-1,0,1,2,3,4]
export const dmgArr = [0.5, 0.75, 1, 1.5, 2, 3, 4]


export const penaltyTable = {
  mobility: [
    "strike",
    "block",
    "evasion",
    "reflex",
    "precision",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
  ],
  injury:[
    "strike",
    "block",
    "evasion",
    "reflex",
    "precision",
    "grapple",
    "sneak",
    "prestidigitation",
    "balance",
    "strength",
    "swim",
    "climb",
  ],
  vision:[
    "strike",
    "block",
    "evasion",
    "reflex",
    "precision",
    "grapple",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
    "detect",
    "explore",
    "cunning"
  ],
  mental:[
    "strike",
    "reflex",
    "precision",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
    "knowledge",
    "spellcast",
    "detect",
    "sense",
    "explore",
    "will",
    "cunning"
  ],
  health:[
    "health"
  ]
}

export const skillsList = {
  strike: 10,
  block: 10,
  evasion: 10,
  reflex: 10,
  precision: 10,
  grapple: 10,
  sneak: 10,
  prestidigitation: 10,
  balance: 10,
  strength: 10,
  health: 10,
  swim: 10,
  climb: 10,
  knowledge: 10,
  spellcast: 10,
  detect: 10,
  sense: 10,
  explore: 10,
  will: 10,
  cunning: 10,
}

export type ArmorType = typeof baseArmor
export type WeaponType = typeof baseWeapon

type InferredCharacterType = typeof baseCharacter
export type CharacterType = Omit<InferredCharacterType, "characterWeapons"> & {
  characterWeapons: {[key: string]: WeaponType}
}

export type WeaponList = typeof weapons
export type SkillsList = typeof skillsList
export type SkillsListKeys = keyof typeof skillsList


const afflictions: {[key:string]: AfflictionItemType} = {
  prone: {isActive: false, mobility: 3},
  grappled: {isActive: false, mobility: 3},
  immobile: {isActive: false, mobility: 3},
  limp: {isActive: false, mobility: 3},

  dazzled: {isActive: false, vision: 2},
  blind: {isActive: false, vision: 5},

  fear: {isActive: false, mental: 1},
  rage: {isActive: false, mental: 1},
  confused: {isActive: false, mental: 3},
  seduced: {isActive: false, },
  distracted: {isActive: false, },
  dominated: {isActive: false, },
}

export type AfflictionItemType = {
  isActive: boolean, 
  mobility?: number,
  vision?:number,
  mental?: number,
  health?:number,
}

export type Afflictionstype = typeof afflictions


export const charResources = {fightName: '', PA:0, STA:0, injuries:{light:[0], mid:[0], dead:[0]}, penalties:{mobility:0, injury:0, health:0, mental:0, vision: 0}, equippedWeapons:{}, turn:0, turnToken:true, isPlaying: false, skills: baseCharacter.skills, afflictions}

export type CharResourcestype = typeof charResources

export type ActiveCharType = CharacterType & {
  resources: CharResourcestype
}