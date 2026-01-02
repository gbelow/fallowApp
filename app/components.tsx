'use client'
import { useEffect, useState } from 'react'
import bus from "./eventBus";
import armors from './armors.json'
import weapons from './weapons.json'
import { ArmorType, WeaponType } from './types';
import { PlayPanel } from './components/PlayPanel';
import { CharacterCreator } from './components/CharacterCreator';
import { scaleWeapon } from './components/utils';
import { JsonObject, createNewCharacter, deleteBaseCharacter, getBasicCharList, getCharacter, getCharacterList } from './actions';
import { useNavigationStore } from './stores/useNavigationStore';
import { makeNewCharacter } from './domain/factories';
import { Character } from './domain/types';
import { useCharacterStore } from './stores/useCharacterStore';


export function ArmorSelector(){

  const handleEquipArmorClick = (armor: ArmorType) => {
    bus.emit("equip-armor", { armor });
  };

  return(
    <div className='text-center w-full'>
      {
        Object.values(armors).map(el => {
          return(
            <input type={'button'} key={el.name} className='text-center w-full hover:bg-gray-500 p-1 ' value={el.name} aria-label={el.name} onClick={() => handleEquipArmorClick(el)}/>
          )
        })
      }

    </div>
  )
}

export function WeaponSelector(){

  const handleEquipWeaponClick = (weapon: WeaponType) => {
    bus.emit("equip-weapon", { weapon });
  };

  const [sWeapons, setSWeapons] = useState(weapons)

  return(
    <div className='text-center w-full'>
      {
        Object.values(sWeapons).map((el:WeaponType) => {
          return(
            <div className='flex flex-row justify-around text-center w-full  ' key={el.name}>
              <input type={'button'}  className='text-center  hover:bg-gray-500 p-1 w-32' value={el.name} aria-label={el.name} onClick={() => el ? handleEquipWeaponClick(scaleWeapon(el, el.scale)): null}/>
              <input className='w-8' type='number' inputMode="numeric" aria-label={el.name} value={el.scale} onChange={(val) => setSWeapons({...sWeapons, [el.name]: {...el, scale: val.target.value}})} />
            </div>
          )
        })
      }
    </div>
  )
}



export function CharacterSelector({charList, initialCharactersList}: {charList: string[], initialCharactersList: JsonObject}){

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [openCampaignChars, setOpenCampaignChars] = useState(false)
  const [charactersList, setCharactersList] = useState<JsonObject>(initialCharactersList)
  const [isLoading, setIsLoading] = useState(false)
  const {selectedGameTab} = useNavigationStore()
  const  characterStore = useCharacterStore()
  
  
  const handleSelectCharacterClick = (character: Character) => {
    bus.emit("select-character", { character });
    characterStore.loadCharacter(character)
  };

  const handleSelectPlayerClick  = async (characterId: string) => {
    const char: Character | null = await getCharacter(characterId)
    if(char) handleSelectCharacterClick(char)
  };

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if(isLoading){
      getBasicCharList().then(resp => {
        setCharactersList(resp)
        setIsLoading(false)
      })

    }
  }, [isLoading])

  useEffect(()=>{
    const getlist = () => setIsLoading(true)
    bus.on("save-character", getlist);

    return () => {
      bus.off("save-character", getlist); // cleanup on unmount
    };
  }, [])

  const createCharacter = (path:string) => {
    createNewCharacter(path, '', makeNewCharacter(path))
    setIsLoading(true)
  }

  const handleDeleteCharacter = (path:string, name:string) => {
    deleteBaseCharacter(path, name)
    setIsLoading(true)
  }

  return (
    <div className="bg-gray-900 text-white p-2">
      {charactersList && Object.entries(charactersList).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([topKey, sub]) => (
        <div key={topKey} className="mb-2">
          {/* Top level */}
          <button
            onClick={() => toggle(topKey)}
            className="w-full text-left font-bold p-2 bg-gray-800 rounded"
          >
            {topKey}
          </button>
          {open[topKey] && (
            <div className=" ml-4 mt-1">
              {sub ? Object.entries(sub).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([midKey, chars]) => (
                <div key={midKey} className='pb-1'>
                  <div key={midKey} className="flex flex-row mb-1 gap-1">
                    {/* Second level */}
                    <button
                      onClick={() => {
                        const char = chars as Character
                        if(char.name && char.attributes.AGI ){
                          handleSelectCharacterClick(char)
                        }else{
                          toggle(`${topKey}-${midKey}`)
                        }
                      }}
                      className="w-full text-left font-semibold p-1 bg-gray-700 rounded"
                    >
                      {midKey}
                    </button >
                    <button className="w-6 text-left font-semibold p-1 bg-gray-700 rounded" onClick={() => createCharacter(topKey+'/'+midKey)}>
                      +
                    </button>
                  </div>
                  <div>
                    {open[`${topKey}-${midKey}`] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {Object.entries(chars).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([charKey, charVal]) => {
                          const val = charVal as Character
                          return(
                            <div
                              key={charKey}
                              className="flex felx-row p-1 bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
                            >
                              <input type={'button'} key={charKey} className='text-center w-full hover:bg-gray-500 p-1 ' value={charKey} aria-label={charKey} onClick={() => handleSelectCharacterClick(val)}/>
                              {/* {charKey} */}
                              {
                                selectedGameTab == 'edit' ?
                                <button className="w-6 text-left font-semibold p-1 bg-red-500 rounded" onClick={() => handleDeleteCharacter(topKey+'/'+midKey, charKey)}>
                                  -
                                </button>
                                : null
                              }
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )): null}
            </div>
          )}
        </div>
      ))}
      {
        <div>
          <input type={'button'} key={'oplay'} className='w-full font-bold bg-gray-800 rounded hover:bg-gray-500 p-1 text-left' value={'PCs'} aria-label={'oplay'} onClick={() => setOpenCampaignChars(!openCampaignChars)}/>
          {
            openCampaignChars && charList.sort().map(el => 
              <div
                key={el}
                className="p-1 bg-gray-600 rounded cursor-pointer hover:bg-gray-500 ml-2"
              >
                <input type={'button'} key={el} className='w-full hover:bg-gray-500 p-1  text-left' value={el} aria-label={el} onClick={() => handleSelectPlayerClick(el)}/>
              </div>
            )
          }
        </div>
      }
    </div>
  );
}

export function Sidebar({initialCharList, initialCharactersList}: {initialCharList: string[], initialCharactersList: JsonObject}){

  const [selectedSidebar, setSelectedSidebar] = useState('') 
  const [charList, setCharList] = useState<string[]>(initialCharList)

  // Keep client-side refetching for when characters are saved/updated
  useEffect(() => {
    getCharacterList().then(resp => {
      setCharList(resp)
    })
  },[])

  return(
    <>
      <div className='flex flex-row items-start justify-between mb-2 '>
        <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedSidebar == 'Armor' ? 'bg-white text-black' : '')} type={'button'} aria-label={'sbar_armor'} value={'Armor'} onClick={() => setSelectedSidebar('Armor')}/>
        <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedSidebar == 'Weapon' ? 'bg-white text-black' : '')} type={'button'} aria-label={'sbar_weapon'} value={'Weapon'} onClick={() => setSelectedSidebar('Weapon')}/>
        <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedSidebar == 'Create' ? 'bg-white text-black' : '')} type={'button'} aria-label={'sbar_char'} value={'Character'} onClick={() => setSelectedSidebar('Character')}/>
      </div>
      {
        selectedSidebar == 'Armor' ?
        <ArmorSelector /> :
        selectedSidebar == 'Weapon' ?
        <WeaponSelector /> :
        selectedSidebar == 'Character' ?
        <CharacterSelector charList={charList} initialCharactersList={initialCharactersList}/>
        : null
      }
    </>
  )
}


export function App({initialCharactersList, initialCharList}: {initialCharactersList: JsonObject, initialCharList: string[]}){

  const {selectedGameTab, setSelectedGameTab} = useNavigationStore()

  const [open, setOpen] = useState(false)

  return(
    <>      
      <header className="py-4 h-12">
        <div className='flex flex-row justify-start items-start text-start gap-2'>
          {/* <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedPage == 'Select' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_select'} value={'Select'} onClick={() => setSelectedPage('Select')}/> */}
          <input className={'py-1 rounded px-2 hover:bg-gray-500 '+ (selectedGameTab == 'edit' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_char'} value={'Character'} onClick={() => setSelectedGameTab('edit')}/>
          {/* <input className={'py-1 rounded px-2 hover:bg-gray-500 '+ (selectedPage == 'Play' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_play'} value={'Play'} onClick={() => setSelectedPage('Play')}/> */}
          <input className={'py-1 rounded px-2 hover:bg-gray-500 hidden md:block '+ (selectedGameTab == 'play' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_play'} value={'Run'} onClick={() => setSelectedGameTab('play')}/>
        </div>
      </header>

      <main className="grid grid-cols-12 w-full h-full">
      <div className="hidden md:block col-span-2 border pr-1 px-1 h-full">
        <Sidebar initialCharList={initialCharList} initialCharactersList={initialCharactersList} />
      </div>

      {/* mobile top menu for sidebar */}
      <div className="md:hidden flex items-center justify-between text-white p-2 h-8">
        <button
          type='button'
          onClick={() => setOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          {/* Hamburger icon */}
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="md:hidden absolute top-0 left-0 w-64 h-full bg-gray-900 text-white shadow-lg z-50">
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-right w-full"
          >
            ✕ Close
          </button>
          <Sidebar initialCharList={initialCharList} initialCharactersList={initialCharactersList} />
        </div>
      )}


      <div className="col-span-12 md:col-span-10 mr-2 md:ml-2 text-sm md:text-md justify-center text-center">
        {
          selectedGameTab == 'edit' ?
            <CharacterCreator /> :
            selectedGameTab == 'play' ?
            <PlayPanel/> :
            null
        }
      </div>
      </main>
    </>
  )
}
