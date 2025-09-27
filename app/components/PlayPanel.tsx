'use client'
import { useEffect, useState } from 'react'
import bus from "../eventBus";
import { ArmorPanel } from './ArmorPanel';
import { WeaponPanel } from './WeaponPanel';
import { ActiveCharType, CharacterType, WeaponType, charResources, penaltyTable, Afflictionstype, AfflictionItemType, MHArr,  } from '../types';
import { scaleArmor } from './utils';

export function PlayPanel({mode}:{mode: string}){

  const [characters, setCharacters] = useState<{[key:string]:ActiveCharType}>({})

  const [currentCharacter, setCurrentCharacter] = useState<ActiveCharType>()

  const [roundCounter, setRoundCounter] = useState(1)
  const [turnCounter, setTurnCounter] = useState(1)
  const [dice10, setDice10] = useState(1)
  const [dice6, setDice6] = useState(1)

  useEffect(()=>{

    const currentChar = localStorage.getItem('currentCharacter') 
    const chars = localStorage.getItem('characters')

    if(chars && Object.keys(chars).length > 0){
      setCharacters(JSON.parse(chars))
    }
    if(currentChar && currentChar != 'undefined'){
      setCurrentCharacter(JSON.parse(currentChar))   
    }

  },[])

  useEffect(() => {
    // const saveState = () => {
    //   localStorage.setItem('currentCharacter', JSON.stringify(currentCharacter))
    //   localStorage.setItem('characters', JSON.stringify(characters))      
    //   console.log(currentCharacter, 'instire')
    // }
    if(currentCharacter){
      localStorage.setItem('currentCharacter', JSON.stringify(currentCharacter))
    }
    if(characters && Object.keys(characters).length > 0){
      localStorage.setItem('characters', JSON.stringify(characters))
    }
    // const timeout = setTimeout(saveState, 500)

    // return(
    //   clearTimeout(timeout)
    // )   

  }, [currentCharacter, characters])

  const updateResource = (rssName: string, value: number|string|object) => {
    setCurrentCharacter((prev) => (prev ? {...prev, resources: {...prev?.resources, [rssName]: value }} : undefined))
  }

  const updateInjury = (val:number|string, ind:number, type: 'light' | 'mid' | 'dead') => {
    const injs = currentCharacter?.resources.injuries[type]
    if(injs){
      const newInjs = injs.map((el: number, index: number) => index == ind ? val : el )
      updateResource('injuries', {...currentCharacter?.resources.injuries, [type]: newInjs})
    }
  }
  
  useEffect(() => {
    const handleSelectCharacterClick = (payload: { character: CharacterType }) => {
      const char = payload.character
      let newName = char.name
      let count = 1
      while(characters[newName] != undefined){
        count++
        newName = char.name + count
      }

      const newChar = {
        ...char, 
        resources: {
          ...charResources, 
          fightName: mode == 'run' ? newName : char.name, 
          PA: char.attributes.AGI/2, 
          STA: char.attributes.CON, 
          equippedWeapons:char.characterWeapons, 
          injuries:{
            light: (new Array(Math.floor(char.attributes.CON/2))).fill(0), 
            mid:(new Array(Math.floor(char.attributes.CON/5))).fill(0), 
            dead:(new Array(2)).fill(0)
          }
        }
      }
      mode == 'run' && setCharacters({...characters, [newName]: newChar })
      setCurrentCharacter(newChar)
    };


    const handleEquipWeaponClick = (payload: {weapon: WeaponType}) => {
      updateResource('equippedWeapons', {...currentCharacter?.resources.equippedWeapons, [payload.weapon.name+payload.weapon.scale]:payload.weapon} )
    }
 
    bus.on("select-character", handleSelectCharacterClick);
    bus.on("equip-weapon", handleEquipWeaponClick);
    
    return () => {
      bus.off("select-character", handleSelectCharacterClick); // cleanup on unmount
      bus.off("equip-weapon", handleEquipWeaponClick);
    };
  }, [characters, currentCharacter, mode]);

  const startTurn = () => {
    if(currentCharacter?.resources.turnToken){
      if(mode == 'run'){
        const charKeys = Object.keys(characters)
        const newChars = {...characters}
        charKeys.forEach(el => newChars[el].resources.isPlaying = false)
        newChars[currentCharacter?.resources.fightName].resources.isPlaying = true
        newChars[currentCharacter?.resources.fightName].resources.turnToken = false
        newChars[currentCharacter?.resources.fightName].resources.turn = turnCounter  
        setCharacters(newChars)
        setTurnCounter(turnCounter+1)
      }
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, isPlaying: true, turnToken: false, turn: turnCounter, PA: Math.min(currentCharacter.resources.PA+currentCharacter.attributes.AGI, currentCharacter.attributes.AGI)}})
    }
  }
  
  const nextRound = () => {
    const charKeys = Object.keys(characters)
    const newChars = {...characters}
    if(Object.values(newChars).filter(el => el.resources.turnToken === true).length <= 0){
      charKeys.forEach(el => {newChars[el].resources.turnToken = true; newChars[el].resources.isPlaying= false})
      setTurnCounter(1)
      setRoundCounter(prev => prev+1)
      setCharacters(newChars)
      if(currentCharacter){
        setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, isPlaying: false, turnToken: true}})
      }
    }
  }

  const resetGame = () => {
    setCharacters({})
    setCurrentCharacter(undefined)
    setRoundCounter(1)
    setTurnCounter(1)
  }

  const killCharacter = () => {
    if(currentCharacter){
      const char = currentCharacter
      const {[char.resources.fightName]: _, ...rest} = characters
      setCharacters(rest)
      setCurrentCharacter(rest[0])
    }
  }

  const updatePenalty = (value: number | string, name: string) => {
    if(currentCharacter){
      const skills = {...currentCharacter.skills}
      const pens = {...currentCharacter.resources.penalties, [name]: value}

      Object.entries(pens).forEach(([key, el]) => {
        const typedKey = key as keyof typeof penaltyTable
        const list = penaltyTable[typedKey]
        list.forEach(item => {
          const it = item as keyof typeof skills
          skills[it] = skills[it] - el 
        })
      })

      setCurrentCharacter({...currentCharacter, resources:{...currentCharacter.resources, penalties: pens, skills} })
    }
  }

  const setAfflictions = (key: string, val:AfflictionItemType) => {
    if(currentCharacter){
      const newAfflictions = {...currentCharacter.resources.afflictions, [key]: val}
      const newPens = {mobility:0, injury: currentCharacter.resources.penalties.injury, health:0, mental:0, vision: 0}
      Object.values(newAfflictions).forEach(el => {
        if(el.isActive){
          newPens.mobility = el.mobility && el.mobility > newPens.mobility ? el.mobility : newPens.mobility
          newPens.mental = el.mental && el.mental > newPens.mental ? el.mental : newPens.mental
          newPens.vision = el.vision && el.vision > newPens.vision ? el.vision : newPens.vision
          newPens.health = newPens.health + (el.health ?? 0)
        }
      });
      
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, afflictions: newAfflictions, penalties: newPens}})
    }
  }

  useEffect(()=> {

    updatePenalty( currentCharacter?.resources.penalties.injury ?? 0,'injury')
  }, [currentCharacter?.resources.afflictions]) 


  return(
    <div className='flex flex-col justify-center '>
      {
        mode == 'run' ?
          <div className='flex flex-col mb-4'>
            <div className='flex flex-row gap-2 mt-2' >
              <span>
                Round: {roundCounter}
              </span>
              <span>
                Turn: {turnCounter}
              </span>
              <input type='button' value='nextRound' aria-label='nextRound' className='p-1 border hover:bg-gray-500 rounded' onClick={nextRound} />              
              <input type='button' value='resetGame' aria-label='resetGame' className='p-1 border hover:bg-gray-500 rounded' onClick={resetGame} />
            </div>
            <div className='flex flex-row gap-2 w-full overflow-auto p-3'>
              {
                Object.entries(characters).map(([key, value]) => 
                  <input className={'p-2 border h-12  '+(value.resources.isPlaying ? 'bg-gray-500' : value.resources.turnToken ? 'bg-blue-400' : '')} type='button' value={key} aria-label={key} key={key} onClick={() => {
                    setCurrentCharacter((prev) => { prev ? setCharacters({...characters, [prev.resources.fightName]: prev}) : null; return value})
                  }}/>
                )
              }
            </div>
          </div>
          : null
      }
      {
        currentCharacter ?
        <div className='grid grid-cols-1 md:grid-cols-12 '>
          <div className='flex flex-col items-center justify-center md:col-span-7 flex flex-col gap-2 text-sm'>
            <div className='flex gap-2 text-xs h-12'>
              <input type='button' value='d10' aria-label='roll' className='p-1 border hover:bg-gray-500 rounded' onClick={() => setDice10(Math.floor(Math.random() * 10) + 1)}/>
              <span>
                Roll: {dice10}
              </span>
              <input type='button' value='d6' aria-label='roll' className='p-1 border hover:bg-gray-500 rounded' onClick={() => setDice6(Math.floor(Math.random() * 6) + 1)}/>
              <span>
                Roll: {dice6}
              </span>
              <input type='button' value='startTurn' aria-label='startTurn' className='p-1 border hover:bg-gray-500 rounded' onClick={startTurn } />  
              <span className='flex flex-wrap w-16'>Ordem no turno {currentCharacter.resources.turn}</span>
            </div>                         
            <div className='flex flex-row gap-2 justify-center '>
              <span className='text-lg'>{currentCharacter.resources.fightName}</span>
              <SimpleResource value={currentCharacter.resources.PA} name={'PA'} setRss={(val) => updateResource('PA', val)}/>
              <SimpleResource value={currentCharacter.resources.STA} name={'STA'} setRss={(val) => updateResource('STA', val)}/>
            </div>
            <div className='flex flex-row gap-1 flex-wrap w-84 md:w-full justify-center items-center'>
              <span>Leves</span>
              {
                currentCharacter.resources.injuries.light.map((inj, ind) => <Injury key={ind} cures={inj} type='light' setRss={(val) => updateInjury(val, ind, 'light')} />)
              }
            </div>
            <div className='flex flex-row gap-1 justify-center'>
              <span>Sérios</span>
              {
                currentCharacter.resources.injuries.mid.map((inj, ind) => <Injury key={ind} cures={inj} type='mid' setRss={(val) => updateInjury(val, ind, 'mid')} />)
              }
            </div>
            <div className='flex flex-row gap-1 justify-center'>
              <span>Mortais</span>
              {
                currentCharacter.resources.injuries.dead.map((inj, ind) => <Injury key={ind} cures={inj} type='dead' setRss={(val) => updateInjury(val, ind, 'dead')} />)
              }
              <input type='button' value='KILL' aria-label='kill' className='p-1 border hover:bg-gray-500 rounded' onClick={killCharacter} />

            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'Mobility'} value={currentCharacter.resources.penalties.mobility}/>
              <SimpleResource value={currentCharacter.resources.penalties.injury} name={'injury'} setRss={(val) => updatePenalty(val, 'injury')}/>
              <SimpleSkill name={'Vision'} value={currentCharacter.resources.penalties.vision}/>
              <SimpleSkill name={'Mental'} value={currentCharacter.resources.penalties.mental}/>
              <SimpleSkill name={'Health'} value={currentCharacter.resources.penalties.health}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'FOR'} value={currentCharacter.attributes.STR}/>
              <SimpleSkill name={'AGI'} value={currentCharacter.attributes.AGI}/>
              <SimpleSkill name={'CON'} value={currentCharacter.attributes.CON}/>
              <SimpleSkill name={'INT'} value={currentCharacter.attributes.INT}/>
              <SimpleSkill name={'POW'} value={currentCharacter.attributes.POW}/>
              <SimpleSkill name={'PER'} value={currentCharacter.attributes.PER}/>
            </div>
            <h2 className='text-xl'>Perícias</h2>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'strike'} value={currentCharacter.resources.skills['strike']}/>
              <SimpleSkill name={'precision'} value={currentCharacter.resources.skills['precision']}/>
              <SimpleSkill name={'evasion'} value={currentCharacter.resources.skills['evasion']}/>
              <SimpleSkill name={'reflex'} value={currentCharacter.resources.skills['reflex']}/>
              <SimpleSkill name={'block'} value={currentCharacter.resources.skills['block']}/>
              <SimpleSkill name={'grapple'} value={currentCharacter.resources.skills['grapple']}/>
              <SimpleSkill name={'DP'} value={8-MHArr[(currentCharacter.size-1) ]*2}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'balance'} value={currentCharacter.resources.skills['balance']}/>
              <SimpleSkill name={'climb'} value={currentCharacter.resources.skills['climb']}/>
              <SimpleSkill name={'strength'} value={currentCharacter.resources.skills['strength']}/>
              <SimpleSkill name={'sneak'} value={currentCharacter.resources.skills['sneak']}/>
              <SimpleSkill name={'prestidigitation'} value={currentCharacter.resources.skills['prestidigitation']}/>
              <SimpleSkill name={'health'} value={currentCharacter.resources.skills['health']}/>
              <SimpleSkill name={'swim'} value={currentCharacter.resources.skills['swim']}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'spellcast'} value={currentCharacter.resources.skills['spellcast']}/>
              <SimpleSkill name={'knowledge'} value={currentCharacter.resources.skills['knowledge']}/>
              <SimpleSkill name={'explore'} value={currentCharacter.resources.skills['explore']}/>
              <SimpleSkill name={'detect'} value={currentCharacter.resources.skills['detect']}/>
              <SimpleSkill name={'sense'} value={currentCharacter.resources.skills['sense']}/>
              <SimpleSkill name={'cunning'} value={currentCharacter.resources.skills['cunning']}/>
              <SimpleSkill name={'spellcast'} value={currentCharacter.resources.skills['spellcast']}/>
            </div>
            <textarea aria-label='notes' className='border rounded p-1 min-h-32 w-84 md:w-full justify-center ' value={currentCharacter.notes} readOnly/>
          </div>
          <div className='flex flex-col md:col-span-5 gap-2 text-sm items-center'>
            <AfflictionsPannel afflictions={currentCharacter.resources.afflictions} setAfflictions={setAfflictions} />
            <ArmorPanel RESnat={currentCharacter.RESnat} INSnat={currentCharacter.INSnat} TENnat={currentCharacter.TENnat} scaledArmor={scaleArmor(currentCharacter.armor, currentCharacter.size)} />
            <div className='flex flex-row gap-2 text-center justify-center'>
              <SimpleSkill name={'RES nat'} value={currentCharacter.RESnat}/>
              <SimpleSkill name={'TEN nat'} value={currentCharacter.TENnat}/>
              <SimpleSkill name={'INS nat'} value={currentCharacter.INSnat}/>
            </div>
            <WeaponPanel characterWeapons={currentCharacter.resources.equippedWeapons} setCharacterWeapons={(val)=> updateResource('equippedWeapons', val)} STR={currentCharacter.attributes.STR}/>
          </div>
        </div>
        : null
      }
    </div>
  )
}

function Injury({cures, setRss, type}: {cures: number, type:string, setRss: (val:string | number) => void }){
  const step = type == 'light' ? 2 : type == 'mid' ? 10 : type == 'dead' ? 20 : 1
  return(
    <div className={'flex flex-col border rounded-full text-center p-1 w-12 h-12 text-center items-center justify-center '+(cures>0 ? 'bg-red-600' : null)}>
      <input className='w-12 text-center' type='number' inputMode="numeric" aria-label={'injury'} value={cures} onChange={(val) => setRss(val.target.value)} />
      <input type='button' aria-label={'causeInjury'} value={'+'} onClick={() => setRss(step)} />
    </div>
  )
}

function SimpleResource({name, value, setRss}: {name: string, value: number, setRss: (val:string | number) => void }){

  return(
    <div className='flex flex-row border rounded text-center justify-around p-1 w-16 overflow-hidden'>
      <div className='flex flex-col w-8'>
        <span>{name.slice(0,10)}</span>
        <span>{value}</span>
      </div>
      <div className='flex flex-col gap-2'>
        <input type='button' className='border rounded-full w-4 h-4 font-bold text-center align-center justify-center ' aria-label={name} value={'+'} onClick={() => setRss(value+1)} />
        <input type='button' className='border rounded-full w-4 h-4 font-bold text-center align-center justify-center ' aria-label={name} value={'-'} onClick={() => setRss(value-1)} />
      </div>
      {/* <input type='number' inputMode="numeric" aria-label={name} value={value} onChange={(val) => setRss(val.target.value)} /> */}
    </div>
  )
}

function SimpleSkill({name, value}: {name: string, value: number}){

  return(
    <div className='flex flex-col border rounded text-center p-1 w-10 md:w-16 overflow-hidden '>
      <span>{name.slice(0,10)}</span>
      <span>{value}</span>
    </div>
  )
}

function AfflictionsPannel({afflictions , setAfflictions}: {afflictions: Afflictionstype, setAfflictions: (key:string, val:AfflictionItemType) => void }){

  return(
    <div className='flex flex-row w-84 md:w-full flex-wrap gap-2 justify-center'>
      {
        Object.entries(afflictions).map(([key, el]) => 
          <input key={key} className={'border p-1 ' + (el.isActive ? 'bg-red-500' : null)} type='button' aria-label={key} value={key} onClick={() => setAfflictions(key, {...el, isActive: !el.isActive})} />
        )
      }
    </div>
  )
}
