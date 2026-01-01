import { useCharacterStore } from "./characterStore/useCharacterStore"

useCharacterStore.getState().updateCharacter(id, c => ({
  ...c,
  attributes: {
    ...c.attributes,
    STR: c.attributes.STR + 1
  }
}))