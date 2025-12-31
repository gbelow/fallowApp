'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import bus from "../eventBus";
import baseArmor from '../baseArmor.json'
import baseWeapon from '../baseWeapon.json'
import { createNewCharacter, deleteCharacter, saveCharacter } from '../actions';
import { SMArr, dmgArr, skillsList, CharacterType, ArmorType, WeaponType, SkillsListKeys, SkillsList, movementList } from '../types';
import { scaleArmor } from './utils';
import { WeaponPanel } from './WeaponPanel';
import { ArmorPanel } from './ArmorPanel';

export function CharacterCreator() {

  const [name, setName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [size, setSize ] = useState(3)
  const SM = SMArr[size-1]
  const DM = dmgArr[size-1]

  const [path, setPath] = useState('')

  const [skey, setSkey] = useState(0)
  const [STR, setSTR ] = useState(10)
  const [AGI, setAGI ] = useState(10)
  const [STA, setSTA ] = useState(10)
  const [CON, setCON ] = useState(0)
  const [INT, setINT ] = useState(0)
  const [SPI, setSPI ] = useState(0)
  const [DEX, setDEX ] = useState(0)

  const [melee, setMelee ] = useState(0)
  const [ranged, setRanged ] = useState(0)
  const [detection, setDetection ] = useState(0)
  const [spellcast, setSpellcast ] = useState(0)
  const [convic1, setConvic1 ] = useState(0)
  const [convic2, setConvic2 ] = useState(0)
  const [devotion, setDevotion ] = useState(0)

  const [RESnat, setRESnat ] = useState(Math.floor(STR*DM/2))
  const [INSnat, setINSnat ] = useState(Math.floor(STR*DM/2))
  const [TGHnat, setTGHnat ] = useState(Math.floor(STR*DM/2))
  const [gearPen, setGearPen ] = useState(0)
  const [hasGauntlets, setHasGauntlets ] = useState(0)
  const [hasHelm, setHasHelm ] = useState(0)

  const [movement, setMovement] = useState(movementList) 
  const [skills, setSkills] = useState(skillsList) 
  const [armor, setArmor] = useState(baseArmor) 
  const [scaledArmor, setScaledArmor] = useState(baseArmor) 
  const [characterWeapons, setCharacterWeapons] = useState({[baseWeapon.name]:baseWeapon}) 

  const [notes, setNotes ] = useState('')
  const [packItems, setPackItems ] = useState('')

  const makeCharacter = () => {
    const character: CharacterType = {
      path,
      name,
      size, 
      attributes:{STR, AGI, STA, CON, INT, SPI, DEX},
      movement,
      STR,
      AGI,
      STA,
      CON,
      INT,
      SPI,
      DEX,
      melee,
      ranged,
      detection,
      spellcast,
      convic1,
      convic2,
      devotion,
      RESnat,
      INSnat,
      TGHnat,
      gearPen,
      hasGauntlets,
      hasHelm,
      characterWeapons,
      armor,
      skills,
      notes,
      packItems
    }
    return character
  }

  const handleLogCharacterClick =() => {
    const character: CharacterType = makeCharacter()
    createNewCharacter(character.path, character.name, character).then(()=>{
      bus.emit("save-character", null);
    })
  }

  const handleSaveCharacterClick = async () => {
    const character: CharacterType = makeCharacter()

    await saveCharacter(character)
  }

  

  const handleDeleteCharacterClick = (name: string) => {
    deleteCharacter(name)
  }

  const loadCharacter = (payload: {character: CharacterType}) => {

    setPath(payload.character.path)
    setName(payload.character.name)
    setSize(payload.character.size)
    setSTR(payload.character.STR)
    setAGI(payload.character.AGI)
    setSTA(payload.character.STA)
    setDEX(payload.character.DEX)
    setSPI(payload.character.SPI)
    setCON(payload.character.CON)
    setINT(payload.character.INT)

    setMelee(payload.character.melee)
    setRanged(payload.character.ranged)
    setDetection(payload.character.detection)
    setSpellcast(payload.character.spellcast)
    setConvic1(payload.character.convic1)
    setConvic2(payload.character.convic2)
    setDevotion(payload.character.devotion)

    setRESnat(payload.character.RESnat)
    setTGHnat(payload.character.TGHnat)
    setINSnat(payload.character.INSnat)

    setGearPen(payload.character.gearPen)
    setHasGauntlets(payload.character.hasGauntlets)
    setHasHelm(payload.character.hasHelm)
    setCharacterWeapons(payload.character.characterWeapons)
    setArmor(payload.character.armor)
    setSkills(payload.character.skills)
    setNotes(payload.character.notes)
    setPackItems(payload.character.packItems)
  }

  const resetSkills = () => setSkills(skillsList)

  const resetAll = () => {
    resetSkills()
    
    setAGI(10)
    setSTR(10)
    setSTA(10)
    setCON(0)
    setINT(0)
    setSPI(0)
    setDEX(0)   

    setSkey(prev => prev+1)
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

  useEffect(() => {
    setTGHnat(Math.floor(STR*DM/2))
    setINSnat(Math.floor(STR*DM/2))
    setRESnat(Math.floor(STR*DM/2))
    setScaledArmor(scaleArmor(armor, size))
    setGearPen(armor.penalty+Object.values(characterWeapons).reduce((acc, el)=> acc + el.penalty , 0))
  }, [size, armor, characterWeapons, STR])

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
          <button className='border p-2 rounded' onClick={resetAll}>Reset</button>
        </div>
          <div className='flex flex-row justify-center gap-2'>
            <label htmlFor="name" className='font-bold'>Name: </label>
            <input id='name' className='border rounded p-1 w-64' type='text' value={name} onChange={(e)=> setName(e.target.value)} />
            <input id='del' className='border rounded bg-red-700 w-12 p-1' type='button' value={'delete'} onClick={()=> setShowConfirm(true)} />
            <input id='log' className='border rounded w-12 p-1' type='button' value={'save'} onClick={handleLogCharacterClick} />
          </div>
        <div className='flex flex-row gap-2 justify-center'>
          <div>AP: {6}</div>
          <div>STA: {STA}</div>
          <div>STA regen: {Math.floor(STA/4)}</div>
          {/* <div>Ferimentos leves: {Math.floor(CON/2)}</div>
          <div>Ferimentos sérios: {Math.floor(CON/5)}</div> */}
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <TextItem stat={movement.basic} setStat={(val)=> setMovement({...movement, basic:val})} title={'basic (1AP)'} />
          <TextItem stat={movement.careful} setStat={(val)=> setMovement({...movement, careful:val})} title={'care (1AP)'} />
          <TextItem stat={movement.crawl} setStat={(val)=> setMovement({...movement, crawl:val})} title={'crawl (1AP)'} />
          {/* <TextItem stat={movement.run} setStat={(val)=> setMovement({...movement, run:val})} title={'run (2AP )'} /> */}
          <Movementinput stat={movement.run} calculatedValue={Math.floor((AGI-gearPen)/3)} setStat={(val)=> setMovement({...movement, run:val})} title={'run (2AP )'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <TextItem stat={movement.swim} setStat={(val)=> setMovement({...movement, swim:val})} title={'swim (1AP)'} />
          <TextItem stat={movement['fast swim']} setStat={(val)=> setMovement({...movement, "fast swim":val})} title={'fast swim (1AP+1STA)'} />
          <Movementinput stat={movement.jump} calculatedValue={Math.floor((AGI-gearPen)/4)} setStat={(val)=> setMovement({...movement, jump:val})} title={'jump (1AP+1STA)'} />
          <Movementinput stat={movement.stand} calculatedValue={5-Math.floor((AGI-gearPen)/5)} setStat={(val)=> setMovement({...movement, stand:val})} title={'stand up'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <StatDial stat={STR} natStat={STR} setStat={setSTR} title={'FOR'} />
          <StatDial stat={AGI} natStat={AGI} setStat={setAGI} title={'AGI'} />
          <StatDial stat={STA} natStat={STA} setStat={setSTA} title={'STA'} />
          <StatDial stat={CON} natStat={CON} setStat={setCON} title={'CON'} />
          <StatDial stat={INT} natStat={INT} setStat={setINT} title={'INT'} />
          <StatDial stat={SPI} natStat={SPI} setStat={setSPI} title={'SPI'} />
          <StatDial stat={DEX} natStat={DEX} setStat={setDEX} title={'DEX'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <StatDial stat={size} natStat={size} setStat={setSize} title={'Size'} />
          <StatDial stat={RESnat} natStat={RESnat} setStat={setRESnat} title={'RES'} />
          <StatDial stat={TGHnat} natStat={TGHnat} setStat={setTGHnat} title={'TGH'} />
          <StatDial stat={INSnat} natStat={INSnat} setStat={setINSnat} title={'INS'} />
          <StatDial stat={gearPen} natStat={gearPen} setStat={setGearPen} title={'Gear pen'} />
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
          <StatDial stat={melee} natStat={melee} setStat={setMelee} title={'Corpo'} />
          <StatDial stat={ranged} natStat={ranged} setStat={setRanged} title={'Distância'} />
          <StatDial stat={detection} natStat={detection} setStat={setDetection} title={'Detecção'} />
          <StatDial stat={spellcast} natStat={spellcast} setStat={setSpellcast} title={'Feitiçaria'} />
          <StatDial stat={convic1} natStat={convic1} setStat={setConvic1} title={'Conviction1'} />
          <StatDial stat={convic2} natStat={convic2} setStat={setConvic2} title={'Conviction2'} />
        </div>

        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'strike'} statName='strike' calculatedValue={ melee } title={'Strike'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'accuracy'} statName='accuracy' calculatedValue={ ranged  - 3*hasGauntlets} title={'accuracy**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'defend'} statName='defend' calculatedValue={ melee  } title={'Defend'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'reflex'} statName='reflex' calculatedValue={ detection+ranged - 3*hasHelm - SM } title={'Reflex'} skills={skills} setSkills={setSkills}/>
          {/* <SkillItem key={skey+'block'} statName='block' calculatedValue={ melee - 2*SM} title={'Bloquear'} skills={skills} setSkills={setSkills}/> */}
          <SkillItem key={skey+'grapple'} statName='grapple' calculatedValue={STR-10 + 5*SM} title={'Grapple'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'cunning'} statName='cunning' calculatedValue={detection-3*hasHelm} title={'Cunning***'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'SD'} statName='SD' calculatedValue={-2-SM*1} title={'SD'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'balance'} statName='balance' calculatedValue={AGI-10} title={'Balance'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'climb'} statName='climb' calculatedValue={AGI-10 - 2*SM-3*hasGauntlets-gearPen} title={'Climb*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'swim'} statName='swim' calculatedValue={AGI-10-gearPen-3*hasHelm} title={'Swim*'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'strength'} statName='strength' calculatedValue={STR-10 + 5*SM} title={'Strength'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'sneak'} statName='sneak' calculatedValue={AGI-10- 3*SM-gearPen} title={'Sneak'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'prestidigitation'} statName='prestidigitation' calculatedValue={DEX-3*hasGauntlets} title={'Prestidigitation**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'health'} statName='health' calculatedValue={CON} title={'Health'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'knowledge'} statName='knowledge' calculatedValue={2*INT} title={'Knowledge'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'explore'} statName='explore' calculatedValue={detection} title={'Explore'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'will'} statName='will' calculatedValue={0} title={'Will'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'charm'} statName='charm' calculatedValue={0} title={'Charm'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'stress'} statName='stress' calculatedValue={0} title={'Stress'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'devotion'} statName='devotion' calculatedValue={SPI} title={'Devotion'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'combustion'} statName='combustion' calculatedValue={+ spellcast} title={'Combustion'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'eletromag'} statName='eletromag' calculatedValue={+ spellcast} title={'Eletromag'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'radiation'} statName='radiation' calculatedValue={+ spellcast} title={'Radiation'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'enthropy'} statName='enthropy' calculatedValue={+ spellcast} title={'Enthropy'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'biomancy'} statName='biomancy' calculatedValue={+ spellcast} title={'Biomancy'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'telepathy'} statName='telepathy' calculatedValue={+ spellcast} title={'Telepathy'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'animancy'} statName='animancy' calculatedValue={+ spellcast} title={'Animancy'} skills={skills} setSkills={setSkills}/>
        </div>

        <textarea aria-label='notes' className='border rounded p-1 min-h-32' onChange={val => setNotes(val.target.value)} value={notes} />
        
        <button type='button' className='border rounded p-2' onClick={handleSaveCharacterClick}>Save</button>
      </div>
      <div className='flex flex-col text-center md:col-span-5  items-center mx-2 gap-2'>
        <ArmorPanel RESnat={RESnat} INSnat={INSnat} TGHnat={TGHnat} scaledArmor={scaledArmor} />
        <WeaponPanel characterWeapons={characterWeapons} setCharacterWeapons={setCharacterWeapons} STR={STR} strike={skills.strike} accuracy={skills.accuracy} />
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


const SkillItem = ({statName, calculatedValue, title, skills, setSkills}:{statName: SkillsListKeys, calculatedValue: number, title: string, skills: SkillsList, setSkills: React.Dispatch<React.SetStateAction<SkillsList>> }) => {

  const val = skills[statName]
  const bonus = useRef(val-calculatedValue)
  
  useEffect(()=>{
    if(val != calculatedValue+bonus.current){
      setSkills((prev)=> ({...prev,  [statName]: calculatedValue+bonus.current}))
    }
  }, [calculatedValue])
 
  useEffect(()=>{
    if(val != calculatedValue+bonus.current){
      bonus.current = (val-calculatedValue)
    }
  }, [val])


  return(
    <div className='flex flex-col w-10 md:w-16 overflow-hidden'>
      <label className='text-xs'>{title.slice(0,10)}</label>
      <input className='p-1 border border-white rounded w-10 md:w-16 text-center' title={title} type='number' inputMode="numeric" value={val} onChange={(e) => setSkills({...skills, [statName]:parseInt(e.target.value)})} />
      <button type='button' className='text-xs bg-gray-800 border' onClick={() => setSkills({...skills, [statName]: calculatedValue})}>Reset</button>
    </div>
  )
}

const StatDial = ({natStat, stat, setStat, title}:{natStat: number, stat: number, setStat: React.Dispatch<React.SetStateAction<number>>, title: string}) => {
  const [val, setVal] = useState(stat+'')
  
  useEffect(()=>{
    setVal(stat+'')
  }, [stat])

  return(
    <div className='flex flex-col w-10 md:w-16 overflow-hidden'>
      <label className='text-xs'>{title}</label>
      <input className='p-1 border border-white rounded w-10 md:w-16 text-center' title={title} type='number' inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => setStat((isNaN(parseInt(val)) ? 0 :parseInt(val))-stat+natStat)} />
    </div>
  )
}

const TextItem = ({stat, setStat, title}:{stat: string, setStat: (val:string) => void, title: string}) => {
  const [val, setVal] = useState(stat)

  return(
    <div className='flex flex-col w-20 md:w-20 overflow-hidden justify-center align-center content-center text-center'>
      <label className='text-xs'>{title}</label>
      <input className='p-1 border border-white rounded w-16 text-center' title={title} type='text'  value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => setStat(val)} />
    </div>
  )
}

function Movementinput  ({stat, setStat, calculatedValue, title}:{stat: number, calculatedValue: number, setStat: (val:number) => void, title: string}){
  const [val, setVal] = useState(stat)

  return(
    <div className='flex flex-col w-20 md:w-20 overflow-hidden justify-center align-center content-center text-center'>
      <label className='text-xs'>{title}</label>
      <input className='p-1 border border-white rounded w-16 text-center' title={title} type='number'  value={val+calculatedValue} onChange={(e) => setVal(parseInt(e.target.value)-calculatedValue)} onBlur={() => setStat(val)} />
    </div>
  )
}