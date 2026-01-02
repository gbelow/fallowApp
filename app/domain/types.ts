export type Attributes = {
  STR: number
  AGI: number
  STA: number
}

export type Talents = {
  CON: number
  INT: number
  SPI: number
  DEX: number
}

export type Skills = {
  "strike": number,
  "defend": number,
  "reflex": number,
  "accuracy": number,
  "grapple": number,
  "SD":number,

  "sneak": number,
  "prestidigitation": number,
  "balance": number,
  "strength": number,
  "health": number,
  "swim": number,
  "climb": number,

  "knowledge": number,
  "detect": number,
  "sense": number,
  "explore": number,
  "cunning": number,
  "will": number,
  "charm": number,
  "stress": number,
  "devotion": number,

  "combustion": number,
  "eletromag": number,
  "radiation": number,
  "enthropy": number,
  "biomancy": number,
  "telepathy": number,
  "animancy": number
}

export type Armor = {
  name: string
  RES: number
  TGH: number
  INS: number
  prot: number
  cover: number
  penalty: number
  type: 'light' | 'medium' | 'heavy'
}

export type Movement = {
  basic: string
  careful: string
  crawl: string
  run: number
  jump: number
  swim: string
  'fast swim': string
  stand: number
}

export type Proficiencies = {
  melee: number
  ranged: number
  detection: number
  spellcast: number
  convic1: number
  convic2: number
  devotion: number
}

export type NaturalResistances = {
  RES: number
  INS: number
  TGH: number
}

export type WeaponAttack = {
  type: 'melee' | 'ranged'
  impact: number
  heavyMod: number
  penMod: number
  range: string
  RES: number
  TGH: number
  AP: number
  deflection: number
  props: string
}

export type Weapon = {
  name: string
  handed: 'small' | 'one' | 'two'
  penalty: number
  scale: number
  attacks: WeaponAttack[]
}

export type Injuries = {
  light: number[],
  serious: number[],
  deadly: number[],
}

export type SurvivalStats = {
  hunger: number,
  thirst: number,
  exhaustion: number
}

export type AfflictionItem = {
  isActive: boolean, 
  mobility?: number,
  vision?:number,
  mental?: number,
  health?:number,
  injury?:number,
  controlable: boolean
}

export type Afflictions = {
  prone: AfflictionItem,
  grappled: AfflictionItem,
  immobile: AfflictionItem,
  limp: AfflictionItem,
  dazzled: AfflictionItem,
  blind: AfflictionItem,
  fear: AfflictionItem,
  rage: AfflictionItem,
  confused: AfflictionItem,
  distracted: AfflictionItem,
  dominated: AfflictionItem,
  seduced: AfflictionItem,
  malnourished: AfflictionItem,
  thirsty: AfflictionItem,
  dehydrated: AfflictionItem,
  tired: AfflictionItem,
  exhausted: AfflictionItem,
  weakened: AfflictionItem,
  sick: AfflictionItem,
}

export type Item = {
  size: number,
  name: string,
  description: string,
}

export type Container = {
  name: string,
  capacity: number,
  penalty: number,
  items:Item[]
}

export type Character = {

  path: string
  name: string
  size: number

  attributes: Attributes
  talents: Talents
  skills: Skills
  movement: Movement
  proficiencies: Proficiencies
  naturalResistances: NaturalResistances
  
  gearPen: number
  hasGauntlets: number
  hasHelm: number
  containers: Record<string, Container>

  armor: Armor
  weapons: Record<string, Weapon>

  notes: string

  // runtime-capable (empty for base)
  injuries?: Injuries
  afflictions?: (keyof Afflictions)[]
  resources?: {AP: number, STA: number}
  survival?: SurvivalStats,
  fightName?: string
  hasActionSurge?: boolean
}