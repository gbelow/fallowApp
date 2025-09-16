'use client'
import { useEffect, useState } from 'react'
import bus from "./eventBus";
import armors from './armors.json'
import weapons from './weapons.json'
import charactersList from './characters.json'
import { ArmorType, WeaponType, CharacterType } from './types';
import { PlayPanel } from './components/PlayPanel';
import { CharacterCreator } from './components/CharacterCreator';
import { scaleWeapon } from './components/utils';
import { getCharacter, getCharacterList } from './actions';

export function ArmorSelector(){

  const handleEquipArmorClick = (armor: ArmorType) => {
    bus.emit("equip-armor", { armor });
  };

  return(
    <div className='text-center'>
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
    <div className='text-center'>
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



export function CharacterSelector({charList}: {charList: string[]}){

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [openPlayer, setOpenPlayer] = useState(false)
  
  const handleSelectCharacterClick = (character: CharacterType) => {
    bus.emit("select-character", { character });
  };

  const handleSelectPlayerClick = async (character: string) => {
    const char: CharacterType | null = await getCharacter(character)
    char &&  handleSelectCharacterClick(char)
  };

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gray-900 text-white p-2">
      {Object.entries(charactersList).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([topKey, sub]) => (
        <div key={topKey} className="mb-2">
          {/* Top level */}
          <button
            onClick={() => toggle(topKey)}
            className="w-full text-left font-bold p-2 bg-gray-800 rounded"
          >
            {topKey}
          </button>
          {open[topKey] && (
            <div className="ml-4 mt-1">
              {Object.entries(sub).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([midKey, chars]) => (
                <div key={midKey} className="mb-1">
                  {/* Second level */}
                  <button
                    onClick={() => {
                      const char = chars as CharacterType
                      if(char.name && char.natAGI ){
                        handleSelectCharacterClick(char)
                      }else{
                        toggle(`${topKey}-${midKey}`)
                      }
                    }}
                    className="w-full text-left font-semibold p-1 bg-gray-700 rounded"
                  >
                    {midKey}
                  </button>
                  {open[`${topKey}-${midKey}`] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {Object.entries(chars).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([charKey, charVal]) => {
                        const val = charVal as CharacterType
                        return(
                          <div
                            key={charKey}
                            className="p-1 bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
                          >
                            <input type={'button'} key={charKey} className='text-center w-full hover:bg-gray-500 p-1 ' value={charKey} aria-label={charKey} onClick={() => handleSelectCharacterClick(val)}/>
                            {/* {charKey} */}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {
        <div>
          <input type={'button'} key={'oplay'} className='w-full font-bold bg-gray-800 rounded hover:bg-gray-500 p-1 text-left' value={'PCs'} aria-label={'oplay'} onClick={() => setOpenPlayer(!openPlayer)}/>
          {
            openPlayer && charList.sort().map(el => 
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

export function Sidebar(){

  const [selectedSidebar, setSelectedSidebar] = useState('') 
  const [charList, setCharList] = useState<string[]>([])

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
        <CharacterSelector charList={charList} />
        : null
      }
    </>
  )
}


export function App(){

  const [selectedPage, setSelectedPage] = useState('Character') 

  const [open, setOpen] = useState(false)

  



  return(
    <>      
      <header className="py-4 h-12">
        <div className='flex flex-row justify-start items-start text-start gap-2'>
          {/* <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedPage == 'Select' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_select'} value={'Select'} onClick={() => setSelectedPage('Select')}/> */}
          <input className={'py-1 rounded px-2 hover:bg-gray-500 '+ (selectedPage == 'Character' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_char'} value={'Character'} onClick={() => setSelectedPage('Character')}/>
          <input className={'py-1 rounded px-2 hover:bg-gray-500 '+ (selectedPage == 'Play' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_play'} value={'Play'} onClick={() => setSelectedPage('Play')}/>
          <input className={'py-1 rounded px-2 hover:bg-gray-500 '+ (selectedPage == 'Run' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_play'} value={'Run'} onClick={() => setSelectedPage('Run')}/>
        </div>
      </header>

      <main className="grid grid-cols-12 ">
      <div className="hidden md:block col-span-2 border pr-1 px-1 h-full">
        <Sidebar />
      </div>

      {/* mobile top menu for sidebar */}
      <div className="md:hidden flex items-center justify-between text-white p-2 h-8">
        <button
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
          <Sidebar />
        </div>
      )}


      <div className="col-span-12 md:col-span-10 mr-2 md:ml-2 text-sm md:text-md justify-center text-center">
        {
          selectedPage == 'Character' ?
            <CharacterCreator /> :
            selectedPage == 'Play' ?
            <PlayPanel mode={'player'}/> :
            selectedPage == 'Run' ?
            <PlayPanel mode={'run'}/> :
            null
        }
      </div>
      </main>
    </>
  )
}
