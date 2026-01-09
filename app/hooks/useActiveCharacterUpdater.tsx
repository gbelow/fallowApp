import { CampaignCharacter, Character } from "../domain/types";
import { useAppStore } from "../stores/useAppStore";
import { useCharacterStore } from "../stores/useCharacterStore";
import { useCombatStore } from "../stores/useCombatStore";


export function useActiveCharacterUpdater(){
  const characterStore = useCharacterStore()
  const combatStore = useCombatStore()
  const appStore = useAppStore(s => s)

  return((updater : (c: Character | CampaignCharacter) => Character | CampaignCharacter) => {
    if(appStore.selectedGameTab == 'edit'){
      characterStore.updateCharacter(updater)
    }
    if(appStore.selectedGameTab == 'play'){
      const activeCharacter = combatStore.getActiveCharacter()
      if(!activeCharacter ) return
      combatStore.updateActiveCharacter(updater as (s:CampaignCharacter) => CampaignCharacter)
    }
  })
}