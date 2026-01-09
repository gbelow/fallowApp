import { makeNewCharacter } from "../domain/factories";
import { CampaignCharacter, Character } from "../domain/types";
import { useAppStore } from "../stores/useAppStore";
import { useCharacterStore } from "../stores/useCharacterStore";
import { addCharacterResources, useCombatStore } from "../stores/useCombatStore";


export function useGetActiveCharacter(): Character | CampaignCharacter {
  const characterStore = useCharacterStore()
  const combatStore = useCombatStore()
  const appStore = useAppStore(s => s)

    if(appStore.selectedGameTab == 'edit' && characterStore.character){
      return characterStore.character
    }
    const combatChar: CampaignCharacter | null = combatStore.getActiveCharacter()
    if(appStore.selectedGameTab == 'play' && combatChar ){
      return combatChar
    }
    return addCharacterResources(makeNewCharacter(''), combatStore.characters)

}