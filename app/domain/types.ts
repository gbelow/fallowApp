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

  "stealth": number,
  "prestidigitation": number,
  "balance": number,
  "strength": number,
  "health": number,
  "swim": number,
  "climb": number,

  "knowledge": number,
  "explore": number,
  "cunning": number,
  "will": number,
  "charm": number,
  "stress": number,
  "devotion": number,

  "combustion": number,
  "eletromag": number,
  "radiation": number,
  "entropy": number,
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
  basic: number
  careful: number
  crawl: number
  run: number
  jump: number
  swim: number
  'fast swim': number
  stand: number
}

export type Proficiencies = {
  melee: number
  ranged: number
  detection: number
  spellcast: number
  conviction1: number
  conviction2: number
  devotion: number
}

export type NaturalResistances = {
  RES: number
  INS: number
  TGH: number
}

export type WeaponAttack = {
  type: string
  handed: string
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
  penalty: number
  scale: number
  attacks: WeaponAttack[]
}

export type Injuries = {
  light: number[],
  serious: number[],
  deadly: number[],
}

export type Resources = {
  AP: number,
  STA: number,
  hunger: number,
  thirst: number,
  exhaustion: number
}

export type AfflictionItem = {
  mobility?: number,
  vision?:number,
  mental?: number,
  health?:number,
  injury?:number,
  controlable: boolean
}

export type Characteristics = Attributes & Talents & Proficiencies & NaturalResistances & { size: number }

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

export type CharacterAfflictions = (keyof Afflictions)[]

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
  
  characteristics: Characteristics
  skills: Skills
  movement: Movement
  
  hasGauntlets: number
  hasHelm: number
  containers: Record<string, Container>
  
  armor: Armor
  weapons: Record<string, Weapon>
  
  notes: string
  
  // runtime-capable (empty for base)
  
  id?:  string | null | undefined
  injuries?: Injuries | undefined
  afflictions?: CharacterAfflictions | undefined
  resources?: Resources | undefined
  fightName?: string | undefined
  hasActionSurge?: boolean | undefined
}

export type CampaignCharacter = Required<Character>