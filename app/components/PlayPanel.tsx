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

  // const calcInjPen = (inj) => {
  //   return Math.floor(inj.light.filter(el => el != 0).length/2) + inj.mid.filter(el => el != 0).length + 2*inj.dead.filter(el => el != 0).length
      
  // }
  
  const updateInjury = (val:number|string, ind:number, type: 'light' | 'mid' | 'dead') => {
    const injs = currentCharacter?.resources.injuries[type]
    if(injs){
      const newInj = injs.map((el: number, index: number) => index == ind ? val : el )
      const newInjs = {...currentCharacter?.resources.injuries, [type]: newInj}
      const injPen = Math.floor(newInjs.light.filter(el => el != 0).length/2) + newInjs.mid.filter(el => el != 0).length + 2*newInjs.dead.filter(el => el != 0).length
      
      setCurrentCharacter((prev) => (prev ? {...prev, resources: {...prev?.resources, injuries: newInjs, penalties: {...prev.resources.penalties, injury: injPen} }} : undefined))
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
          STA: char.STA, 
          survival:{hunger:0, thirst:0, exhaustion:0},
          equippedWeapons:char.characterWeapons, 
          injuries:{
            light: (new Array(Math.floor(6))).fill(0), 
            mid:(new Array(Math.floor(3))).fill(0), 
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
    if(currentCharacter){
      if(mode == 'run'){
        const charKeys = Object.keys(characters)
        const newChars = {...characters}
        charKeys.forEach(el => newChars[el].resources.isPlaying = false)
        newChars[currentCharacter?.resources.fightName].resources.isPlaying = true
        // newChars[currentCharacter?.resources.fightName].resources.turnToken = false
        // newChars[currentCharacter?.resources.fightName].resources.turn = turnCounter  
        setCharacters(newChars)
        // setTurnCounter(turnCounter+1)
      }
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, isPlaying: true}})
    }
  }
  
  const useSurge = () => {
    if(currentCharacter){
      const newChars = {...characters}
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, surgeToken: false}})
      
    }
  }
  
  const nextRound = () => {
    const charKeys = Object.keys(characters)
    const newChars = {...characters}
    // if(Object.values(newChars).filter(el => el.resources.turnToken === true).length <= 0){
      charKeys.forEach(el => {newChars[el].resources.surgeToken = true; newChars[el].resources.isPlaying= false, newChars[el].resources.PA= Math.min(newChars[el].resources.PA+6, 6)})
      // setTurnCounter(1)
      setRoundCounter(prev => prev+1)
      setCharacters(newChars)
      if(currentCharacter){
        setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, isPlaying: false, PA: Math.min(currentCharacter.resources.PA+6, 6)}})
      }
    // }
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

  const setAfflictions = (key: string, val:AfflictionItemType) => {
    if(currentCharacter){
      const newAfflictions = {...currentCharacter.resources.afflictions, [key]: val}       
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, afflictions: newAfflictions}})
    }
  }

  const updateAfflictions = () => {

    if(currentCharacter){
      const newAfflictions = {...currentCharacter.resources.afflictions}
      const newPens = {mobility:0, injury: currentCharacter.resources.penalties.injury, health:0, mental:0, vision: 0}
      Object.values(newAfflictions).forEach(el => {
        if(el.isActive){
          newPens.mobility = el.mobility && el.mobility > newPens.mobility ? el.mobility : newPens.mobility
          newPens.mental = el.mental && el.mental > newPens.mental ? el.mental : newPens.mental
          newPens.vision = el.vision && el.vision > newPens.vision ? el.vision : newPens.vision
          newPens.health = newPens.health + (el.health ?? 0)
        }
      });

      const skills = {...currentCharacter.skills}

      Object.entries(newPens).forEach(([key, el]) => {
        const typedKey = key as keyof typeof penaltyTable
        const list = penaltyTable[typedKey]
        list.forEach(item => {
          const it = item as keyof typeof skills
          skills[it] = skills[it] - el 
        })
      })
      
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, penalties: newPens, skills}})
    }
  }

  useEffect(()=> {

    updateAfflictions()
  }, [currentCharacter?.resources.afflictions, currentCharacter?.resources.injuries]) 


  const updateSurvival = (val:number, stat:string) => {
    if(currentCharacter){
      updateResource('survival', {...currentCharacter.resources.survival, [stat]: val})
      const afflicts = {...currentCharacter.resources.afflictions}
      if(stat == 'hunger'){
        if(val > 15) {afflicts.weakened.isActive = true} else {afflicts.weakened.isActive = false}
        if(val > 60) {afflicts.malnourished.isActive = true} else {afflicts.malnourished.isActive = false}
      }
      if(stat == 'thirst'){
        if(val > 10) {afflicts.thirsty.isActive = true} else {afflicts.thirsty.isActive = false}
        if(val > 15) {afflicts.dehydrated.isActive = true} else {afflicts.dehydrated.isActive = false}
      }
      if(stat == 'exhaustion'){
        if(val > currentCharacter.STA/2) {afflicts.tired.isActive = true} else {afflicts.tired.isActive = false}
        if(val > currentCharacter.STA) {afflicts.exhausted.isActive = true} else {afflicts.exhausted.isActive = false}
      }
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, survival:{...currentCharacter.resources.survival, [stat]: val}, afflictions: afflicts } })
    }
  }


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
                  <input className={'p-2 border h-12  '+(value.resources.isPlaying ? 'bg-gray-500' : value.resources.surgeToken ? 'bg-blue-400' : '')} type='button' value={key} aria-label={key} key={key} onClick={() => {
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
              <input type='button' value='action surge' aria-label='action surge' className={'p-1 border hover:bg-gray-500 rounded '+(currentCharacter.resources.surgeToken ? 'bg-gray-500': '')} onClick={useSurge } />  
              {/* <span className='flex flex-wrap w-16'>Ordem no turno {currentCharacter.resources.turn}</span> */}
            </div>                         
            <div className='flex flex-row gap-2 justify-center '>
              <span className='text-lg'>{currentCharacter.resources.fightName}</span>
              <SimpleResource value={currentCharacter.resources.PA} name={'PA'} setRss={(val) => updateResource('PA', val)}/>
              <SimpleResource value={currentCharacter.resources.STA} name={'STA'} setRss={(val) => updateResource('STA', currentCharacter.STA > parseInt(val+'') ? val : currentCharacter.STA )}/>
              <SimpleResource value={currentCharacter.resources.survival.hunger} name={'hunger'} setRss={(val) => updateSurvival(parseInt(val+''), 'hunger')}/>
              <SimpleResource value={currentCharacter.resources.survival.thirst} name={'thirst'} setRss={(val) => updateSurvival(parseInt(val+''), 'thirst') }/>
              <SimpleResource value={currentCharacter.resources.survival.exhaustion} name={'exhaust'} setRss={(val) => updateSurvival(parseInt(val+''), 'exhaustion')}/>
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
              <SimpleMove value={currentCharacter.movement.basic}  name={'basic (1PA)'} />
              <SimpleMove value={currentCharacter.movement.careful}  name={'care (1PA)'} />
              <SimpleMove value={currentCharacter.movement.crawl}  name={'crawl (1PA)'} />
              <SimpleMove value={currentCharacter.movement.run}  name={'run (2PA )'} />
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleMove value={currentCharacter.movement.swim}  name={'swim (1PA)'} />
              <SimpleMove value={currentCharacter.movement['fast swim']}  name={'fast swim (1PA+1STA)'} />
              <SimpleMove value={currentCharacter.movement.jump}  name={'jump (1PA+1STA)'} />
              <SimpleMove value={currentCharacter.movement.stand}  name={'stand up'} />
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'Mobility'} value={currentCharacter.resources.penalties.mobility}/>
              <SimpleSkill name={'Injury'} value={currentCharacter.resources.penalties.injury}  />
              <SimpleSkill name={'Vision'} value={currentCharacter.resources.penalties.vision}/>
              <SimpleSkill name={'Mental'} value={currentCharacter.resources.penalties.mental}/>
              <SimpleSkill name={'Health'} value={currentCharacter.resources.penalties.health}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'FOR'} value={currentCharacter.attributes.STR}/>
              <SimpleSkill name={'AGI'} value={currentCharacter.attributes.AGI}/>
              <SimpleSkill name={'STA'} value={currentCharacter.attributes.STA}/>
              <SimpleSkill name={'CON'} value={currentCharacter.attributes.CON}/>
              <SimpleSkill name={'INT'} value={currentCharacter.attributes.INT}/>
              <SimpleSkill name={'SPI'} value={currentCharacter.attributes.SPI}/>
              <SimpleSkill name={'DEX'} value={currentCharacter.attributes.DEX}/>
            </div>
            <h2 className='text-md'>Perícias</h2>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'strike'} value={currentCharacter.resources.skills['strike']}/>
              <SimpleSkill name={'precision'} value={currentCharacter.resources.skills['precision']}/>
              <SimpleSkill name={'evasion'} value={currentCharacter.resources.skills['evasion']}/>
              <SimpleSkill name={'reflex'} value={currentCharacter.resources.skills['reflex']}/>
              <SimpleSkill name={'block'} value={currentCharacter.resources.skills['block']}/>
              <SimpleSkill name={'grapple'} value={currentCharacter.resources.skills['grapple']}/>
              <SimpleSkill name={'DP'} value={-2-MHArr[(currentCharacter.size-1) ]*2}/>
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
              <SimpleSkill name={'knowledge'} value={currentCharacter.resources.skills['knowledge']}/>
              <SimpleSkill name={'explore'} value={currentCharacter.resources.skills['explore']}/>
              <SimpleSkill name={'cunning'} value={currentCharacter.resources.skills['cunning']}/>
              <SimpleSkill name={'will'} value={currentCharacter.resources.skills['will']}/>
              <SimpleSkill name={'enchant'} value={currentCharacter.resources.skills['enchant']}/>
              <SimpleSkill name={'stress'} value={currentCharacter.resources.skills['stress']}/>
              <SimpleSkill name={'devotion'} value={currentCharacter.resources.skills['devotion']}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'combustion'} value={currentCharacter.resources.skills['combustion']}/>
              <SimpleSkill name={'eletromag'} value={currentCharacter.resources.skills['eletromag']}/>
              <SimpleSkill name={'radiation'} value={currentCharacter.resources.skills['radiation']}/>
              <SimpleSkill name={'enthropy'} value={currentCharacter.resources.skills['enthropy']}/>
              <SimpleSkill name={'biomancy'} value={currentCharacter.resources.skills['biomancy']}/>
              <SimpleSkill name={'telepathy'} value={currentCharacter.resources.skills['telepathy']}/>
              <SimpleSkill name={'animancy'} value={currentCharacter.resources.skills['animancy']}/>
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
      <div className='flex flex-col w-8 text-xs'>
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
    <div className='flex flex-col border rounded text-center p-1 w-10 md:w-16 overflow-hidden text-xs'>
      <span>{name.slice(0,10)}</span>
      <span>{value}</span>
    </div>
  )
}

function SimpleMove({name, value}: {name: string, value: number| string}){
  return(
    <div className='flex flex-col border rounded text-center p-1 w-20 md:w-24 overflow-hidden text-xs'>
      <span>{name.slice(0,10)}</span>
      <span>{value}</span>
    </div>
  )
}

function AfflictionsPannel({afflictions , setAfflictions}: {afflictions: Afflictionstype, setAfflictions: (key:string, val:AfflictionItemType) => void }){

  return(
    <div className='flex flex-row w-84 md:w-full flex-wrap gap-2 justify-center text-xs'>
      {
        Object.entries(afflictions).map(([key, el]) => 
          <input key={key} className={'border p-1 ' + (el.isActive ? 'bg-red-500' : null)} type='button' aria-label={key} value={key} onClick={() => setAfflictions(key, {...el, isActive: !el.isActive})} />
        )
      }
    </div>
  )
}
