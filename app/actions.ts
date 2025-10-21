"use server"

import redis from './redis'
import { CharacterType } from './types';
import fs from "fs";
import path from "path";


export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export function loadJsonFromFolder(baseDir: string): JsonObject {
  const result: JsonObject = {};

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      // Recursively load subfolders
      result[entry.name] = loadJsonFromFolder(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      // Remove .json extension
      const key = path.basename(entry.name, ".json");
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as JsonValue;
      result[key] = content;
    }
  }

  return result;
}


export async function getBasicCharList(){
  const dataDir = path.join(process.cwd(), "app/characters");
  const characterData = loadJsonFromFolder(dataDir);
  return characterData
}

export async function createNewCharacter(
  folderPath: string,
  fileName: string,
  data: CharacterType
) {
  const targetDir = path.join('app/characters', folderPath);

  // Ensure the directory exists
  fs.mkdirSync(targetDir, { recursive: true });

  // Define the target file path
  const filePath = path.join(targetDir, `${fileName}.json`);

  // Write the file (pretty-printed)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  await deleteBaseCharacter(targetDir, '')
  console.log(`✅ Created: ${filePath}`);
}

export async function deleteBaseCharacter(
  folderPath: string,
  fileName: string
) {
  const filePath = path.join('app/characters', folderPath, `${fileName}.json`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Deleted: ${filePath}`);
  } else {
    console.warn(`⚠️ File not found: ${filePath}`);
  }
}


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