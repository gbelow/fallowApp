"use server"

import redis from './redis'
import { CharacterType } from './types';

export async  function saveCharacter(character: CharacterType){
  const list: string[] = await redis.get('charList') ?? []
  await redis.set('charList', [...list, character.name ]);

  await redis.set(character.name, character);
  // const resp = await redis.get(character.name);

}

export async  function deleteCharacter(name: string){
  const list: string[] = await redis.get('charList') ?? []
  await redis.set('charList',list.filter(el => el != name));

  await redis.del(name);

}

export async function getCharacter(name: string){
  const character: CharacterType | null = await redis.get(name)
  if(character){
    return character
  }
  return null
}


export async function getCharacterList(){
  const list : string[] | null = await redis.get('charList')
  if(list != null){
    return list
  }
  return []
}