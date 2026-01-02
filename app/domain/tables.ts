
export const SkillPenaltyTable = {
  "mobility": [
    "strike",
    "defend",
    "reflex",
    "accuracy",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
  ],
  "injury":[
    "strike",
    "defend",
    "reflex",
    "accuracy",
    "grapple",
    "sneak",
    "prestidigitation",
    "balance",
    "strength",
    "swim",
    "climb",
  ],
  "vision":[
    "strike",
    "defend",
    "reflex",
    "accuracy",
    "grapple",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
    "explore",
    "cunning",
    "detect"
  ],
  "mental":[
    "strike",
    "reflex",
    "accuracy",
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
  "health":[
    "health"
  ]
}

export const SMArr = [-2,-1,0,1,2,3,4]
export const dmgArr = [0.5, 0.75, 1, 1.5, 2, 3, 4]

export const afflictions = {
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