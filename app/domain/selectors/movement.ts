import { Character } from "../types";
import { getAGI } from "./characteristics";
import { getGearPenalties } from "./gear";

// Returns just the stored value from character.movement if set, or default string/number
const getRaw = (c: Character, key: keyof Character["movement"]) => {
  return c.movement[key];
};

export function getBasicMovement(c: Character) { 
  return getRaw(c, "basic");
}
export function getCarefulMovement(c: Character) {
  return getRaw(c, "careful");
}
export function getCrawlMovement(c: Character) {
  return getRaw(c, "crawl");
}
export function getRunMovement(c: Character) {
  return Math.floor((getAGI(c) - getGearPenalties(c)) / 3)+getRaw(c, "run");
}
export function getSwimMovement(c: Character) {
  return getRaw(c, "swim");
}
export function getFastSwimMovement(c: Character) {
  return getRaw(c, "fast swim");
}
export function getJumpMovement(c: Character) {
  return Math.floor((getAGI(c) - getGearPenalties(c)) / 4)+getRaw(c, "jump");
}
export function getStandMovement(c: Character) {
  return 5 - Math.floor((getAGI(c) - getGearPenalties(c)) / 5)+getRaw(c, "stand");
}
