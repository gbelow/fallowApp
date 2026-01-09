import { makeCharacterResources } from "./factories"
import { CampaignCharacter, Character } from "./types"

function makeFightName(char: Character, characters: Record<string, Character>){
  let newName = char.name
  let count = 1
  while(Object.values(characters).find(el => el.fightName == newName) ){
    count++
    newName = char.name + count
  }
  return newName
}

export function addCharacterResources(char: Character, characters: Record<string, Character>) : CampaignCharacter {
  const fightName = makeFightName(char, characters)
  const id = crypto.randomUUID()
  const resources = makeCharacterResources(char)
  if(!isCampaignCharacter(char))  return { ...char, ...resources, id, fightName }
  return { ...char, fightName }
}

export function isCampaignCharacter(
  c: Character | CampaignCharacter
): c is CampaignCharacter {
  return (
    c.id !== undefined &&
    c.injuries !== undefined &&
    c.afflictions !== undefined &&
    c.resources !== undefined &&
    c.fightName !== undefined &&
    c.hasActionSurge !== undefined
  );
}