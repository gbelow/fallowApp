import { movementSelectors, skillSelectors } from ".";
import { CampaignCharacter, Character, Characteristics, Injuries, Movement, Resources, Skills } from "../types";
import { characteristicSelectors } from ".";

export function makeSkillSelector (skillName: keyof Skills){
  return((character: Character) => {
    if (!character || !skillSelectors[skillName]) return 0;
    return skillSelectors[skillName](character)
  })
}

export function makeSkillUpdater (skillName:keyof Skills, value: number) {
  return( (character: Character) => {
    const calculated = skillSelectors[skillName](character) - character.skills[skillName]
    const updated = {...character, skills: {...character.skills, [skillName]: value - calculated}}
    return updated
  }) 
}

export function makeCharacteristicSelector (characteristic: keyof Characteristics){
  return((character: Character) => {
    if (!character || !characteristicSelectors[characteristic]) return 0;
    return characteristicSelectors[characteristic](character)
  })
}

export function makeCharacteristicUpdater(characteristic: keyof Characteristics, value: number){
  return((character: Character) => {
    const calculated = characteristicSelectors[characteristic](character) - character.characteristics[characteristic]
    const updated = {...character, characteristics: {...character.characteristics, [characteristic]: value - calculated}}
    return updated
  })
}

export function makeMovementSelector (move: keyof Movement){
  return((character: Character) => {
    if (!character || !movementSelectors[move]) return 0;
    return movementSelectors[move](character)
  })
}

export function makeMovementUpdater(moveName: keyof Movement, value: number){
  return((character: Character) => {
    const calculated = movementSelectors[moveName](character) - character.movement[moveName]
    const updated = {...character, movement: {...character.movement, [moveName]: value - calculated}}
    return updated
  })
}

export function makeTextSelector (keyName: keyof Character){
  return((character: Character) => {
    if (!character || !character[keyName]) return '';
    return character[keyName]
  })
}

export function makeTextUpdater(keyName: keyof Character , value: string){
  return((character: Character) => {
    return ({...character, [keyName]: value})
  })
}

export function makeResourceSelector (keyName: keyof Resources){
  return((character: CampaignCharacter) => {
    if (!character || !character.resources[keyName]) return 0;
    return character.resources[keyName]
  })
}

export function makeResourceUpdater(keyName: keyof Resources , value: number){
  return((character: CampaignCharacter) => {
    return ({...character, resources:{...character.resources, [keyName]: value}})
  })
}

export function makeInjurySelector (keyName: keyof Injuries){
  return((character: CampaignCharacter) => {
    if (!character || !character.injuries[keyName]) return [];
    return character.injuries[keyName]
  })
}

export function makeInjuryUpdater(keyName: keyof Injuries , index: number, value: number){
  return((character: CampaignCharacter) => {
    const newInjury = [...character.injuries[keyName]]
    newInjury[index] = value
    return ({...character, injuries:{...character.injuries, [keyName]: newInjury}})
  })
}

