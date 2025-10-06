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
    "explore",
    "cunning",
    "detect"
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
    "explore",
    "will",
    "cunning",
    "combustion",
    "eletromag",
    "radiation",
    "enthropy",
    "biomancy",
    "telepathy",
    "animancy",
    "detect"
  ],
  health:[
    "health"
  ]
}


export const skillsList = baseCharacter.skills


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
  prone: {isActive: false, mobility: 3, controlable: true},
  grappled: {isActive: false, mobility: 3, controlable: true},
  immobile: {isActive: false, mobility: 3, controlable: true},
  limp: {isActive: false, mobility: 3, controlable: true},

  dazzled: {isActive: false, vision: 2, controlable: true},
  blind: {isActive: false, vision: 8, controlable: true},

  fear: {isActive: false, mental: 1, controlable: true},
  rage: {isActive: false, mental: 1, controlable: true},
  confused: {isActive: false, mental: 3, controlable: true},
  seduced: {isActive: false, controlable: true},
  distracted: {isActive: false, controlable: true},
  dominated: {isActive: false, controlable: true},
  
  weakened: {isActive: false, health: 2, controlable: true},
  malnourished: {isActive: false, health: 2, controlable: true},
  thirsty: {isActive: false, health: 2, controlable: true},
  dehydrated: {isActive: false, health: 2, controlable: true},
  tired: {isActive: false, mental: 1, controlable: true},
  exhausted: {isActive: false, mental: 2, controlable: true},
  sick: {isActive: false, health: 2, controlable: true},
}

export type AfflictionItemType = {
  isActive: boolean, 
  mobility?: number,
  vision?:number,
  mental?: number,
  health?:number,
  injury?:number,
  controlable: boolean
}

export type Afflictionstype = typeof afflictions


export const charResources = {
  fightName: '', PA:6, STA:0, 
  survival:{hunger:0, thirst:0, exhaustion:0},
  injuries:{light:[0], mid:[0], dead:[0]}, 
  penalties:{mobility:0, injury:0, health:0, mental:0, vision: 0}, 
  equippedWeapons:{}, equippedArmor: baseArmor,surgeToken:true, isPlaying: false, 
  skills: baseCharacter.skills, afflictions
}

export type CharResourcestype = typeof charResources

export type ActiveCharType = CharacterType & {
  resources: CharResourcestype
}

//run, jump and stand without calculated component
export const movementList = {
  "basic":"1m",
  "careful":"0.5m",
  "crawl":"0.33m",
  "run":0,
  "jump":0,
  "swim":"0.33m",
  "fast swim":"0.5m",
  "stand":0
}

export type MovementTypes = typeof movementList