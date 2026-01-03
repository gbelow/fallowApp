'use client'

import { useEffect,  useState } from 'react'
import bus from "../eventBus";
import baseArmor from '../baseArmor.json'
import baseWeapon from '../baseWeapon.json'
import { deleteCharacter } from '../actions';
import { skillsList, CharacterType, ArmorType, WeaponType, movementList } from '../types';
import { scaleArmor } from './utils';
import { WeaponPanel } from './WeaponPanel';
import { ArmorPanel } from './ArmorPanel';
import baseCharacter from '../baseCharacter.json'
import { useCharacterStore } from '../stores/useCharacterStore';
import { Character, Characteristics, Movement, Skills } from '../domain/types';
import { makeCharacteristicSelector, makeCharacteristicUpdater, makeMovementSelector, makeMovementUpdater, makeSkillSelector, makeSkillUpdater, makeTextSelector, makeTextUpdater } from '../domain/selectors/factories';

export function CharacterCreator() {

  const [name, setName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false);
  

  const [path, setPath] = useState('')

  const [skey, setSkey] = useState(0)  


  const [hasGauntlets, setHasGauntlets ] = useState(0)
  const [hasHelm, setHasHelm ] = useState(0)

  const [armor, setArmor] = useState(baseArmor) 
  const [scaledArmor, setScaledArmor] = useState(baseArmor) 
  const [characterWeapons, setCharacterWeapons] = useState({[baseWeapon.name]:baseWeapon}) 

  const [notes, setNotes ] = useState('')
  const [packItems, setPackItems ] = useState('')

  const store = useCharacterStore()
  

  const handleDeleteCharacterClick = (name: string) => {
    deleteCharacter(name)
  }

  const loadCharacter = (payload: {character: CharacterType}) => {

    setPath(payload.character.path)
    setName(payload.character.name)
    setHasGauntlets(payload.character.hasGauntlets)
    setHasHelm(payload.character.hasHelm)
    setCharacterWeapons(payload.character.characterWeapons)
    setArmor(payload.character.armor)
    setNotes(payload.character.notes)
    setPackItems(payload.character.packItems)
  }
  

  useEffect(() => {
    const handleEquipArmor = (payload: { armor: ArmorType }) => {
      setArmor(payload.armor)
    };
    const handleEquipWeapon = (payload: { weapon: WeaponType }) => {
      const newCharWeapons = {...characterWeapons, [payload.weapon.name+payload.weapon.scale]:payload.weapon}
      setCharacterWeapons(newCharWeapons)
    };

    bus.on("equip-armor", handleEquipArmor);
    bus.on("equip-weapon", handleEquipWeapon);

    return () => {
      bus.off("equip-armor", handleEquipArmor); // cleanup on unmount
      bus.off("equip-weapon", handleEquipWeapon); // cleanup on unmount
    };
  }, [characterWeapons]);


  useEffect(()=>{
    bus.on("select-character", loadCharacter);

    return () => {
      bus.off("select-character", loadCharacter); // cleanup on unmount
    };
  },[])

  
  // size, race, abilities, armor penalties, injuries, movements, AP, STA, STA regen
  return (
    <div className='grid grid-col-1 md:grid-cols-12 w-full px-1'>
      <div className='md:col-span-7 flex flex-col gap-2 text-sm gap-2 px-1'>
        <div>
          {/* <button className='border p-2 rounded' onClick={resetAll}>Reset</button> */}
        </div>
          <div className='flex flex-row justify-center gap-2'>
            <label htmlFor="name" className='font-bold'>Name: </label>
            <TextItem keyName={'name'} title={'name'}/>
            {/* <input id='name' className='border rounded p-1 w-64' type='text' value={name} onChange={(e)=> setName(e.target.value)} /> */}
            <input id='del' className='border rounded bg-red-700 w-12 p-1' type='button' value={'delete'} onClick={()=> setShowConfirm(true)} />
            {/* <input id='log' className='border rounded w-12 p-1' type='button' value={'save'} onClick={handleLogCharacterClick} /> */}
          </div>
        <div className='flex flex-row gap-2 justify-center'>
          <div>AP: {6}</div>
          <div>STA: {store.character?.characteristics.STA}</div>
          <div>STA regen: {Math.floor((store.character?.characteristics.STA ?? 0)/4)}</div>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <Movementinput movementName={'basic'}  title={'basic (1AP)'} />
          <Movementinput movementName={'careful'}  title={'care (1AP)'} />
          <Movementinput movementName={'crawl'}  title={'crawl (1AP)'} />
          <Movementinput movementName={'run'} title={'run (2AP )'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <Movementinput movementName={'swim'}  title={'swim (1AP)'} />
          <Movementinput movementName={'fast swim'}  title={'fast swim (1AP+1STA)'} />
          <Movementinput movementName={'jump'}  title={'jump (1AP+1STA)'} />
          <Movementinput movementName={'stand'}  title={'stand up'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <ZtatDial stat={'STR'} title={'STR'} />
          <ZtatDial stat={'AGI'} title={'AGI'} />
          <ZtatDial stat={'STA'} title={'STA'} />
          <ZtatDial stat={'CON'} title={'CON'} />
          <ZtatDial stat={'DEX'} title={'DEX'} />
          <ZtatDial stat={'INT'} title={'INT'} />
          <ZtatDial stat={'SPI'} title={'SPI'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <ZtatDial stat={'size'} title={'size'} />
          <ZtatDial stat={'RES'} title={'RES'} />
          <ZtatDial stat={'TGH'} title={'SPI'} />
          <ZtatDial stat={'INS'} title={'INS'} />
          {/* <StatDial stat={gearPen} natStat={gearPen} setStat={setGearPen} title={'Gear pen'} /> */}
          <div className='flex flex-col'>
            <label>Gauntlet</label>
            <input type='checkbox' aria-label={'gaunt'} name={'gaunt'} checked={!!hasGauntlets} onChange={(e) => setHasGauntlets(e.target.checked ? 1 : 0)} />
          </div>
          <div className='flex flex-col'>
            <label>Full Helm</label>
            <input type='checkbox' aria-label={'helm'} name={'helm'} checked={!!hasHelm} onChange={(e) => setHasHelm(e.target.checked ? 1 : 0)} />
          </div>

        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <ZtatDial stat={'melee'} title={'Corpo'} />
          <ZtatDial stat={'ranged'} title={'Distância'} />
          <ZtatDial stat={'detection'} title={'Detecção'} />
          <ZtatDial stat={'spellcast'} title={'Feitiçaria'} />
          <ZtatDial stat={'conviction1'} title={'Conviction1'} />
          <ZtatDial stat={'conviction2'} title={'Conviction2'} />
        </div>

        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'strike'} skillName='strike' title='strike' />
          <SkillItem key={skey+'accuracy'} skillName='accuracy' title='accuracy' />
          <SkillItem key={skey+'defend'} skillName='defend' title='defend' />
          <SkillItem key={skey+'reflex'} skillName='reflex' title='reflex' />
          <SkillItem key={skey+'grapple'} skillName='grapple' title='grapple' />
          <SkillItem key={skey+'cunning'} skillName='cunning' title='cunning' />
          <SkillItem key={skey+'SD'} skillName='SD' title='SD' />
          
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'balance'} skillName='balance' title='balance' />
          <SkillItem key={skey+'climb'} skillName='climb' title='climb' />
          <SkillItem key={skey+'swim'} skillName='swim' title='swim' />
          <SkillItem key={skey+'strength'} skillName='strength' title='strength' />
          <SkillItem key={skey+'stealth'} skillName='stealth' title='stealth' />
          <SkillItem key={skey+'prestidigitation'} skillName='prestidigitation' title='prestidigitation' />
          <SkillItem key={skey+'health'} skillName='health' title='health' />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'knowledge'} skillName='knowledge' title='knowledge' />
          <SkillItem key={skey+'explore'} skillName='explore' title='explore' />
          <SkillItem key={skey+'will'} skillName='will' title='will' />
          <SkillItem key={skey+'charm'} skillName='charm' title='charm' />
          <SkillItem key={skey+'stress'} skillName='stress' title='stress' />
          <SkillItem key={skey+'devotion'} skillName='devotion' title='devotion' />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'combustion'} skillName='combustion' title='combustion' />
          <SkillItem key={skey+'eletromag'} skillName='eletromag' title='eletromag' />
          <SkillItem key={skey+'radiation'} skillName='radiation' title='radiation' />
          <SkillItem key={skey+'entropy'} skillName='entropy' title='entropy' />
          <SkillItem key={skey+'biomancy'} skillName='biomancy' title='biomancy' />
          <SkillItem key={skey+'telepathy'} skillName='telepathy' title='telepathy' />
          <SkillItem key={skey+'animancy'} skillName='animancy' title='animancy' />
        </div>

        <textarea aria-label='notes' className='border rounded p-1 min-h-32' onChange={val => setNotes(val.target.value)} value={notes} />
        
        {/* <button type='button' className='border rounded p-2' onClick={handleSaveCharacterClick}>Save</button> */}
      </div>
      <div className='flex flex-col text-center md:col-span-5  items-center mx-2 gap-2'>
        {/* <ArmorPanel RESnat={RESnat} INSnat={INSnat} TGHnat={TGHnat} scaledArmor={scaledArmor} /> */}
        {/* <WeaponPanel characterWeapons={characterWeapons} setCharacterWeapons={setCharacterWeapons} STR={attributes.STR} strike={skills.strike} accuracy={skills.accuracy} /> */}
        <span>Items</span>
        <textarea aria-label='pack' className='border rounded p-1 min-h-32 w-full' onChange={val => setPackItems(val.target.value)} value={packItems} />
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black w-64 h-32 m-auto">
          <div className="p-4 rounded shadow-md w-64">
            <p className="mb-4">Are you sure you want to delete {name}?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {handleDeleteCharacterClick(name); setShowConfirm(false)}}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SkillItem({ title, skillName}:{title: string, skillName: keyof Skills}){ 
  const store = useCharacterStore()
  const value = store.character ? makeSkillSelector(skillName)(store.character) : 0
  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => 
    store.updateCharacter(makeSkillUpdater(skillName, parseInt(e.target.value))) 

  return(
    <div className='flex flex-col w-10 md:w-16 overflow-hidden'>
      <label className='text-xs'>{title.slice(0,10)}</label>
      <input className='p-1 border border-white rounded w-10 md:w-16 text-center' title={title} type='number' inputMode="numeric" value={value} onChange={setValue} />
      {/* <button type='button' className='text-xs bg-gray-800 border' onClick={() => setSkills({...skills, [statName]: calculatedValue})}>Reset</button> */}
    </div>
  )
}

function ZtatDial ({stat, title}:{stat: keyof Characteristics, title: string}){
  const store = useCharacterStore()
  const value = store.character ? makeCharacteristicSelector(stat)(store.character) : 0
  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => 
    store.updateCharacter(makeCharacteristicUpdater(stat, parseInt(e.target.value))) 

  return(
    <div className='flex flex-col w-10 md:w-16 overflow-hidden'>
      <label className='text-xs'>{title}</label>
      <input className='p-1 border border-white rounded w-10 md:w-16 text-center' title={title} type='number' inputMode="numeric" value={value} onChange={setValue} />
    </div>
  )
}


const TextItem = ({keyName, title}:{keyName: keyof Character, title: string}) => {
  const store = useCharacterStore()
  const value = store.character ? makeTextSelector(keyName)(store.character) : ''
  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => 
    store.updateCharacter(makeTextUpdater(keyName, e.target.value))

  return(
    <div className='flex flex-col w-20 md:w-20 overflow-hidden justify-center align-center content-center text-center'>
      <label className='text-xs'>{title}</label>
      <input className='p-1 border border-white rounded w-16 text-center' title={title} type='text'  value={value} onChange={setValue} />
    </div>
  )
}

function Movementinput  ({movementName, title}:{movementName: keyof Movement, title: string}){
  const store = useCharacterStore()
  const value = store.character ? makeMovementSelector(movementName)(store.character) : 0
  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => 
    store.updateCharacter(makeMovementUpdater(movementName, (parseFloat(e.target.value))))

  return(
    <div className='flex flex-col w-20 md:w-20 overflow-hidden justify-center align-center content-center text-center'>
      <label className='text-xs'>{title}</label>
      <div>
        <input className='p-1 border border-white rounded w-16 text-center' title={title} type='number' value={value} onChange={setValue} />
      </div>
    </div>
  )
}