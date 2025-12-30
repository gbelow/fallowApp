'use client'
import { useEffect, useState } from 'react'
import bus from "../eventBus";
import { ArmorPanel } from './ArmorPanel';
import { WeaponPanel } from './WeaponPanel';
import { ActiveCharType, CharacterType, WeaponType, charResources, penaltyTable, Afflictionstype, AfflictionItemType, ArmorType,  } from '../types';
import { makeFullRoll, scaleArmor } from './utils';


export function PlayPanel({mode}:{mode: string}){

  const [characters, setCharacters] = useState<{[key:string]:ActiveCharType}>({})

  const [currentCharacter, setCurrentCharacter] = useState<ActiveCharType>()

  const [roundCounter, setRoundCounter] = useState(1)
  const [turnCounter, setTurnCounter] = useState(1)
  const [dice10, setDice10] = useState(1)
  const [dice6, setDice6] = useState(1)

  const [rolledSkill, setRolledSkill] = useState({name:'', value:0})

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
          equippedArmor:char.armor, 
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

    const handleEquipArmorClick = (payload: {armor: ArmorType}) => {
      updateResource('equippedArmor', payload.armor )
    }
 
    bus.on("select-character", handleSelectCharacterClick);
    bus.on("equip-weapon", handleEquipWeaponClick);
    bus.on("equip-armor", handleEquipArmorClick);
    
    return () => {
      bus.off("select-character", handleSelectCharacterClick); // cleanup on unmount
      bus.off("equip-weapon", handleEquipWeaponClick);
      bus.off("equip-armor", handleEquipArmorClick);
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
  
  const actSurge = (type: string) => {
    if(currentCharacter && currentCharacter.resources.STA >= 3 && currentCharacter.resources.surgeToken){
      const amount = type == 'move'? 6: 6
      const cost = 3+Math.floor(getGearPen()/3)
      const updatedChar = {...currentCharacter, resources: {...currentCharacter.resources, surgeToken: false, STA: currentCharacter.resources.STA-3, PA:currentCharacter.resources.PA+amount  }}
      setCurrentCharacter(updatedChar)
      setCharacters({...characters, [currentCharacter.resources.fightName]: updatedChar })
    }
  }
  
  const useRest = () => {
    if(currentCharacter){
      const newSTA = Math.min(currentCharacter.resources.STA+Math.floor(currentCharacter.STA/4), currentCharacter.STA )
      const updatedChar = {...currentCharacter, resources: {...currentCharacter.resources, STA: newSTA, PA:currentCharacter.resources.PA-4  }}
      setCurrentCharacter(updatedChar)
      setCharacters({...characters, [currentCharacter.resources.fightName]: updatedChar })
    }
  }
  
  const nextRound = () => {
      const newChars = Object.entries(characters).reduce((acc, [fname, el]) => ({...acc, [fname]:{...el, resources:{...el.resources, surgeToken: true, isPlaying: false, PA:  Math.min(el.resources.PA+6, 6)} }}), {})
      setRoundCounter(prev => prev+1)
      setCharacters(newChars)
      if(currentCharacter){
        setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, surgeToken: true, isPlaying: false, PA: Math.min(currentCharacter.resources.PA+6, 6)}})
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
      const newChar = {...currentCharacter, resources: {...currentCharacter.resources, penalties: newPens, skills}}
      setCurrentCharacter(newChar)
      setCharacters({...characters, [newChar.resources.fightName]: newChar })
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
      const newChar = {...currentCharacter, resources: {...currentCharacter.resources, survival:{...currentCharacter.resources.survival, [stat]: val}, afflictions: afflicts } }
      setCurrentCharacter(newChar)
      setCharacters({...characters, [newChar.resources.fightName]: newChar })
    }
  }

  const getGearPen = () => {
    if(currentCharacter){
      const weaps:WeaponType[] = Object.values(currentCharacter?.resources.equippedWeapons)
      const pen = currentCharacter?.resources.equippedArmor.penalty + weaps.reduce((acc, el) => acc+el.penalty, 0)
      return pen
    }
    return 0
  }

  const rollSkill = (name:string, value: number) => {
    const roll = makeFullRoll()
    setRolledSkill({name, value:value+roll})
  }


  return(
    <div className='flex flex-col justify-center '>
      {
        mode == 'run' ?
          <div className='flex flex-col'>
            <div className='flex flex-row gap-2 w-full' >
              <span>
                Round: {roundCounter}
              </span>
              <span>
                Turn: {turnCounter}
              </span>
              <input type='button' value='nextRound' aria-label='nextRound' className='p-1 border hover:bg-gray-500 rounded' onClick={nextRound} />              
              <input type='button' value='resetGame' aria-label='resetGame' className='p-1 border hover:bg-gray-500 rounded ml-auto mr-2' onClick={resetGame} />
            </div>
            <div className='flex flex-row gap-2 w-full overflow-auto p-3'>
              {
                Object.entries(characters).map(([key, value]) => 
                  <input className={'p-2 border h-12  '+(value.resources.fightName  == currentCharacter?.resources.fightName ? 'bg-red-500' : value.resources.isPlaying ? 'bg-gray-500' : value.resources.surgeToken ? 'bg-blue-400' : '')} 
                    type='button' value={key} aria-label={key} key={key} 
                    onClick={() => {
                      currentCharacter ? setCharacters({...characters, [currentCharacter.resources.fightName]: currentCharacter}) : null
                      setCurrentCharacter(value.resources.fightName == currentCharacter?.resources.fightName ? currentCharacter : value)
                    }}
                  />
                )
              }
            </div>
          </div>
          : null
      }
      {
        currentCharacter ?
        <div className='grid grid-cols-1 md:grid-cols-12 py-1'>
          <div className='flex flex-col items-center justify-center md:col-span-7 flex flex-col gap-2 text-sm py-1 md:mr-2'>
            <div className='flex gap-2 text-xs h-8'>
              <input type='button' value='startTurn' aria-label='startTurn' className='p-1 border hover:bg-gray-500 rounded' onClick={startTurn } />  
              <span className='text-lg'>{currentCharacter.resources.fightName}</span>
              <input type='button' value='d10' aria-label='roll' className='p-1 border hover:bg-gray-500 rounded' onClick={() => setDice10(Math.floor(Math.random() * 10) + 1)}/>
              <span>
                Roll: {dice10}
              </span>
              <input type='button' value='d6' aria-label='roll' className='p-1 border hover:bg-gray-500 rounded' onClick={() => setDice6(Math.floor(Math.random() * 6) + 1)}/>
              <span>
                Roll: {dice6}
              </span>
              <input type='button' value='action surge' aria-label='action surge' className={'p-1 border hover:bg-gray-500 rounded '+(currentCharacter.resources.surgeToken ? 'bg-gray-500': '')} onClick={() => actSurge('') } />  
              <input type='button' value='move surge' aria-label='action surge' className={'p-1 border hover:bg-gray-500 rounded '+(currentCharacter.resources.surgeToken ? 'bg-gray-500': '')} onClick={() => actSurge('move') } />  
              <input type='button' value='rest' aria-label='action surge' className={'p-1 border hover:bg-gray-500 rounded '} onClick={ useRest } />  
              {/* <span className='flex flex-wrap w-16'>Ordem no turno {currentCharacter.resources.turn}</span> */}
            </div>                         
            <div className='flex flex-row gap-2 justify-center '>
              <SimpleResource value={currentCharacter.resources.PA} name={'PA'} setRss={(val) => updateResource('PA', val)}/>
              <SimpleResource value={currentCharacter.resources.STA} name={'STA'} setRss={(val) => updateResource('STA', currentCharacter.STA > parseInt(val+'') ? val : currentCharacter.STA )}/>
              <SimpleResource value={currentCharacter.resources.survival.hunger} name={'hunger'} setRss={(val) => updateSurvival(parseInt(val+''), 'hunger')}/>
              <SimpleResource value={currentCharacter.resources.survival.thirst} name={'thirst'} setRss={(val) => updateSurvival(parseInt(val+''), 'thirst') }/>
              <SimpleResource value={currentCharacter.resources.survival.exhaustion} name={'exhaust'} setRss={(val) => updateSurvival(parseInt(val+''), 'exhaustion')}/>
            </div>
            <div className='flex flex-row gap-1 flex-wrap w-84 md:w-full justify-center items-center'>
              <span>Light</span>
              {
                currentCharacter.resources.injuries.light.map((inj, ind) => <Injury key={ind} cures={inj} type='light' setRss={(val) => updateInjury(val, ind, 'light')} />)
              }
            </div>
            <div className='flex flex-row gap-1 justify-center'>
              <span>Serious</span>
              {
                currentCharacter.resources.injuries.mid.map((inj, ind) => <Injury key={ind} cures={inj} type='mid' setRss={(val) => updateInjury(val, ind, 'mid')} />)
              }
            </div>
            <div className='flex flex-row gap-1 justify-center'>
              <span>Deadly</span>
              {
                currentCharacter.resources.injuries.dead.map((inj, ind) => <Injury key={ind} cures={inj} type='dead' setRss={(val) => updateInjury(val, ind, 'dead')} />)
              }
              <input type='button' value='KILL' aria-label='kill' className='p-1 border hover:bg-gray-500 rounded' onClick={killCharacter} />

            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleMove value={currentCharacter.movement.basic}  name={'basic (1PA)'} />
              <SimpleMove value={currentCharacter.movement.careful}  name={'care (1PA)'} />
              <SimpleMove value={currentCharacter.movement.crawl}  name={'crawl (1PA)'} />
              <SimpleMove value={currentCharacter.movement.run+Math.floor((currentCharacter.AGI-getGearPen())/3)}  name={'run (2PA )'} />
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleMove value={currentCharacter.movement.swim}  name={'swim (1PA)'} />
              <SimpleMove value={currentCharacter.movement['fast swim']}  name={'swim (1PA+1STA)'} />
              <SimpleMove value={currentCharacter.movement.jump+Math.floor((currentCharacter.AGI-getGearPen())/4)}  name={'jump (1PA+1STA)'} />
              <SimpleMove value={currentCharacter.movement.stand+5-Math.floor((currentCharacter.AGI-getGearPen())/5)}  name={'stand up'} />
            </div>
            {/* <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'Mobilidade'} value={currentCharacter.resources.penalties.mobility}/>
              <SimpleSkill name={'Ferimento'} value={currentCharacter.resources.penalties.injury}  />
              <SimpleSkill name={'Visão'} value={currentCharacter.resources.penalties.vision}/>
              <SimpleSkill name={'Mental'} value={currentCharacter.resources.penalties.mental}/>
              <SimpleSkill name={'Saúde'} value={currentCharacter.resources.penalties.health}/>
            </div> */}
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'FOR'} value={currentCharacter.attributes.STR}/>
              <SimpleSkill name={'AGI'} value={currentCharacter.attributes.AGI-getGearPen()}/>
              <SimpleSkill name={'STA'} value={currentCharacter.attributes.STA}/>
              <SimpleSkill name={'CON'} value={currentCharacter.attributes.CON}/>
              <SimpleSkill name={'INT'} value={currentCharacter.attributes.INT}/>
              <SimpleSkill name={'SPI'} value={currentCharacter.attributes.SPI}/>
              <SimpleSkill name={'DEX'} value={currentCharacter.attributes.DEX}/>
            </div>
            <div className='flex flex-row'>
              <h2 className='text-md'>Last roll:</h2>
              <span className='px-4'>{rolledSkill.name} : {rolledSkill.value}</span>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'strike'} value={currentCharacter.resources.skills['strike']} rollSkill={rollSkill}/>
              <SimpleSkill name={'accuracy'} value={currentCharacter.resources.skills['accuracy']} rollSkill={rollSkill}/>
              <SimpleSkill name={'defend'} value={currentCharacter.resources.skills['defend']} rollSkill={rollSkill}/>
              <SimpleSkill name={'reflex'} value={currentCharacter.resources.skills['reflex']} rollSkill={rollSkill}/>
              {/* <SimpleSkill name={'bloqueio'} value={currentCharacter.resources.skills['block']} rollSkill={rollSkill}/> */}
              <SimpleSkill name={'grapple'} value={currentCharacter.resources.skills['grapple']} rollSkill={rollSkill}/>
              <SimpleSkill name={'cunning'} value={currentCharacter.resources.skills['cunning']} rollSkill={rollSkill}/>
              <SimpleSkill name={'SD'} value={currentCharacter.resources.skills['SD']}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'balance'} value={currentCharacter.resources.skills['balance']} rollSkill={rollSkill}/>
              <SimpleSkill name={'climb'} value={currentCharacter.resources.skills['climb']} rollSkill={rollSkill}/>
              <SimpleSkill name={'strength'} value={currentCharacter.resources.skills['strength']} rollSkill={rollSkill}/>
              <SimpleSkill name={'sneak'} value={currentCharacter.resources.skills['sneak']} rollSkill={rollSkill}/>
              <SimpleSkill name={'prestidigitation'} value={currentCharacter.resources.skills['prestidigitation']} rollSkill={rollSkill}/>
              <SimpleSkill name={'health'} value={currentCharacter.resources.skills['health']} rollSkill={rollSkill}/>
              <SimpleSkill name={'swim'} value={currentCharacter.resources.skills['swim']} rollSkill={rollSkill}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'knowledge'} value={currentCharacter.resources.skills['knowledge']} rollSkill={rollSkill}/>
              <SimpleSkill name={'explore'} value={currentCharacter.resources.skills['explore']} rollSkill={rollSkill}/>
              <SimpleSkill name={'will'} value={currentCharacter.resources.skills['will']} rollSkill={rollSkill}/>
              <SimpleSkill name={'charm'} value={currentCharacter.resources.skills['charm']} rollSkill={rollSkill}/>
              <SimpleSkill name={'stress'} value={currentCharacter.resources.skills['stress']} rollSkill={rollSkill}/>
              <SimpleSkill name={'devotion'} value={currentCharacter.resources.skills['devotion']} rollSkill={rollSkill}/>
            </div>
            <div className='flex flex-row gap-2 justify-center'>
              <SimpleSkill name={'combustion'} value={currentCharacter.resources.skills['combustion']} rollSkill={rollSkill}/>
              <SimpleSkill name={'eletromag'} value={currentCharacter.resources.skills['eletromag']} rollSkill={rollSkill}/>
              <SimpleSkill name={'radiation'} value={currentCharacter.resources.skills['radiation']} rollSkill={rollSkill}/>
              <SimpleSkill name={'enthropy'} value={currentCharacter.resources.skills['enthropy']} rollSkill={rollSkill}/>
              <SimpleSkill name={'biomancy'} value={currentCharacter.resources.skills['biomancy']} rollSkill={rollSkill}/>
              <SimpleSkill name={'telepathy'} value={currentCharacter.resources.skills['telepathy']} rollSkill={rollSkill}/>
              <SimpleSkill name={'animancy'} value={currentCharacter.resources.skills['animancy']} rollSkill={rollSkill}/>
            </div>
            <textarea aria-label='notes' className='border rounded p-1 min-h-32 w-84 md:w-full justify-center ' value={currentCharacter.notes} readOnly/>
          </div>
          <div className='flex flex-col md:col-span-5 gap-2 text-sm items-center'>
            <AfflictionsPannel afflictions={currentCharacter.resources.afflictions} setAfflictions={setAfflictions} />
            <ArmorPanel RESnat={currentCharacter.RESnat} INSnat={currentCharacter.INSnat} TGHnat={currentCharacter.TGHnat} scaledArmor={scaleArmor(currentCharacter.resources.equippedArmor, currentCharacter.size)} />
            <div className='flex flex-row gap-2 text-center justify-center'>
              <SimpleSkill name={'RES nat'} value={currentCharacter.RESnat}/>
              <SimpleSkill name={'TGH nat'} value={currentCharacter.TGHnat}/>
              <SimpleSkill name={'INS nat'} value={currentCharacter.INSnat}/>
            </div>
            <WeaponPanel 
              characterWeapons={currentCharacter.resources.equippedWeapons} 
              setCharacterWeapons={(val)=> updateResource('equippedWeapons', val)} 
              STR={currentCharacter.attributes.STR} 
              strike={currentCharacter.resources.skills.strike}
              accuracy={currentCharacter.resources.skills.accuracy}
            />
            <span>Itens</span>
            <textarea aria-label='pack' className='border rounded p-1 min-h-32 w-full' value={currentCharacter?.packItems ?? ''}  readOnly />
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

function SimpleSkill({name, value, rollSkill}: {name: string, value: number, rollSkill?: (name:string, value:number)=> void}){
  return(
    <div className='flex flex-col border rounded text-center p-1 w-10 md:w-16 overflow-hidden text-xs' onClick={() => rollSkill ? rollSkill(name, value) : null}>
      <span>{name.slice(0,10)}</span>
      <span>{value}</span>
    </div>
  )
}

function SimpleMove({name, value}: {name: string, value: number| string}){
  return(
    <div className='flex flex-col border rounded text-center p-1 w-20 md:w-28 overflow-hidden text-xs'>
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