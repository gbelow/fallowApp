'use client'

import { useEffect, useMemo, useState } from 'react'
import bus from "../eventBus";
import baseArmor from '../baseArmor.json'
import baseWeapon from '../baseWeapon.json'
import { deleteCharacter, saveCharacter } from '../actions';
import { MHArr, dmgArr, skillsList, CharacterType, ArmorType, WeaponType, SkillsListKeys, SkillsList, movementList } from '../types';
import { scaleArmor } from './utils';
import { WeaponPanel } from './WeaponPanel';
import { ArmorPanel } from './ArmorPanel';

export function CharacterCreator() {

  const [name, setName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [size, setSize ] = useState(3)
  const MH = MHArr[size-1]
  const MD = dmgArr[size-1]

  const [skey, setSkey] = useState(0)
  const [natSTR, setNatSTR ] = useState(10)
  const [natAGI, setNatAGI ] = useState(10)
  const [natCON, setNatCON ] = useState(10)
  const [natINT, setNatINT ] = useState(10)
  const [natPOW, setNatPOW ] = useState(10)
  const [natPER, setNatPER ] = useState(10)


  const [ath, setAth ] = useState(0)
  const [melee, setMelee ] = useState(0)
  const [ranged, setRanged ] = useState(0)
  const [edu, setEdu ] = useState(0)
  const [cast, setCast ] = useState(0)
  const [convic, setConvic ] = useState(0)
  const [subt, setSubt ] = useState(0)

  const STR = useMemo(()=>natSTR + Math.floor(ath/2) + ath%2, [natSTR, ath])
  const AGI = useMemo(()=>natAGI + Math.floor(ath/2), [natAGI, ath])
  const CON = useMemo(()=>natCON, [natCON])
  const INT = useMemo(()=>natINT + Math.floor(edu/2), [natINT, edu])
  const POW = useMemo(()=>natPOW + Math.floor(cast/2), [natPOW, cast])
  const PER = useMemo(()=>natPER + Math.floor(subt/2), [natPER, subt])

  const [RESnat, setRESnat ] = useState(5*MD)
  const [INSnat, setINSnat ] = useState(5*MD)
  const [TENnat, setTENnat ] = useState(5*MD)
  const [gearPen, setGearPen ] = useState(0)
  const [hasGauntlets, setHasGauntlets ] = useState(0)
  const [hasHelm, setHasHelm ] = useState(0)

  const [movement, setMovement] = useState(movementList) 
  const [skills, setSkills] = useState(skillsList) 
  const [armor, setArmor] = useState(baseArmor) 
  const [scaledArmor, setScaledArmor] = useState(baseArmor) 
  const [characterWeapons, setCharacterWeapons] = useState({[baseWeapon.name]:baseWeapon}) 

  const [notes, setNotes ] = useState('')

  const makeCharacter = () => {
    const character: CharacterType = {
      name,
      size, 
      attributes:{STR, AGI, CON, INT, POW, PER},
      movement,
      natSTR,
      natAGI,
      natCON,
      natINT,
      natPOW,
      natPER,
      ath,
      melee,
      ranged,
      edu,
      cast,
      convic,
      subt,
      RESnat,
      INSnat,
      TENnat,
      gearPen,
      hasGauntlets,
      hasHelm,
      characterWeapons,
      armor,
      skills,
      notes
    }
    return character
  }

  const handleLogCharacterClick =() => {
    const character: CharacterType = makeCharacter()
    console.log(character)
  }

  const handleSaveCharacterClick = async () => {
    const character: CharacterType = makeCharacter()

    await saveCharacter(character)
  }

  

  const handleDeleteCharacterClick = (name: string) => {
    deleteCharacter(name)
  }

  const loadCharacter = (payload: {character: CharacterType}) => {

    setName(payload.character.name)
    setSize(payload.character.size)
    setNatSTR(payload.character.natSTR)
    setNatAGI(payload.character.natAGI)
    setNatPER(payload.character.natPER)
    setNatPOW(payload.character.natPOW)
    setNatCON(payload.character.natCON)
    setNatINT(payload.character.natINT)
    setAth(payload.character.ath)
    setMelee(payload.character.melee)
    setRanged(payload.character.ranged)
    setEdu(payload.character.edu)
    setCast(payload.character.cast)
    setConvic(payload.character.convic)
    setSubt(payload.character.subt)
    setRESnat(payload.character.RESnat)
    setTENnat(payload.character.TENnat)
    setINSnat(payload.character.INSnat)
    setGearPen(payload.character.gearPen)
    setHasGauntlets(payload.character.hasGauntlets)
    setHasHelm(payload.character.hasHelm)
    setCharacterWeapons(payload.character.characterWeapons)
    setArmor(payload.character.armor)
    setSkills(payload.character.skills)
    setNotes(payload.character.notes)
  }

  const resetSkills = () => setSkills(skillsList)

  const resetAll = () => {
    resetSkills()
    
    setNatAGI(10)
    setNatSTR(10)
    setNatCON(10)
    setNatINT(10)
    setNatPOW(10)
    setNatPER(10)
    
    setAth(0)
    setMelee(0)
    setRanged(0)
    setEdu(0)
    setCast(0)
    setConvic(0)
    setSubt(0)

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
    setRESnat(Math.floor(5*MD))
    setTENnat(Math.floor(5*MD))
    setINSnat(Math.floor(5*MD))
    setScaledArmor(scaleArmor(armor, size))
    setGearPen(armor.penalty+Object.values(characterWeapons).reduce((acc, el)=> acc + el.penalty , 0))
  }, [size, armor, characterWeapons])

  useEffect(()=>{
    bus.on("select-character", loadCharacter);

    return () => {
      bus.off("select-character", loadCharacter); // cleanup on unmount
    };
  },[])

  
  // size, race, abilities, armor penalties, injuries, movements, AP, STA, STA regen
  return (
    <div className='grid grid-col-1 md:grid-cols-12 w-full px-1'>
      <div className='md:col-span-7 flex flex-col gap-2 text-sm gap-2'>
        <div>
          <button className='border p-2 rounded' onClick={resetAll}>Reset</button>
        </div>
          <div className='flex flex-row justify-center gap-2'>
            <label htmlFor="name" className='font-bold'>Nome: </label>
            <input id='name' className='border rounded p-1 w-64' type='text' value={name} onChange={(e)=> setName(e.target.value)} />
            <input id='del' className='border rounded bg-red-700 w-12 p-1' type='button' value={'delete'} onClick={()=> setShowConfirm(true)} />
            <input id='log' className='border rounded w-12 p-1' type='button' value={'log'} onClick={handleLogCharacterClick} />
          </div>
        <div className='flex flex-row gap-2 justify-center'>
          <div>PA: {AGI-(armor.type == "medium" ? 1 : armor.type == "heavy" ? 2 : 0)}</div>
          <div>STA: {CON-(armor.type == "medium" ? 1 : armor.type == "heavy" ? 2 : 0)}</div>
          <div>STA regen: {Math.floor(CON/3)}</div>
          <div>Ferimentos leves: {Math.floor(CON/2)}</div>
          <div>Ferimentos sérios: {Math.floor(CON/5)}</div>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <TextItem stat={movement.basic} setStat={(val)=> setMovement({...movement, basic:val})} title={'basic (1PA)'} />
          <TextItem stat={movement.careful} setStat={(val)=> setMovement({...movement, careful:val})} title={'care (1PA)'} />
          <TextItem stat={movement.crawl} setStat={(val)=> setMovement({...movement, crawl:val})} title={'crawl (1PA)'} />
          <TextItem stat={movement.run} setStat={(val)=> setMovement({...movement, run:val})} title={'run (2PA +1STA)'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <TextItem stat={movement.swim} setStat={(val)=> setMovement({...movement, swim:val})} title={'swim (1PA)'} />
          <TextItem stat={movement['fast swim']} setStat={(val)=> setMovement({...movement, "fast swim":val})} title={'fast swim (1PA+1STA)'} />
          <TextItem stat={movement.jump} setStat={(val)=> setMovement({...movement, jump:val})} title={'jump (1PA+1STA)'} />
          <TextItem stat={movement.stand} setStat={(val)=> setMovement({...movement, stand:val})} title={'stand up'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <StatDial stat={STR} natStat={natSTR} setStat={setNatSTR} title={'FOR'} />
          <StatDial stat={AGI} natStat={natAGI} setStat={setNatAGI} title={'AGI'} />
          <StatDial stat={CON} natStat={natCON} setStat={setNatCON} title={'CON'} />
          <StatDial stat={INT} natStat={natINT} setStat={setNatINT} title={'INT'} />
          <StatDial stat={POW} natStat={natPOW} setStat={setNatPOW} title={'POW'} />
          <StatDial stat={PER} natStat={natPER} setStat={setNatPER} title={'PER'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <StatDial stat={size} natStat={size} setStat={setSize} title={'Size'} />
          <StatDial stat={RESnat} natStat={RESnat} setStat={setRESnat} title={'RES'} />
          <StatDial stat={TENnat} natStat={TENnat} setStat={setTENnat} title={'TEN'} />
          <StatDial stat={INSnat} natStat={INSnat} setStat={setINSnat} title={'INS'} />
          <StatDial stat={gearPen} natStat={gearPen} setStat={setGearPen} title={'Gear pen'} />
          <div className='flex flex-col'>
            <label>manop</label>
            <input type='checkbox' aria-label={'gaunt'} name={'gaunt'} checked={!!hasGauntlets} onChange={(e) => setHasGauntlets(e.target.checked ? 1 : 0)} />
          </div>
          <div className='flex flex-col'>
            <label>capacete</label>
            <input type='checkbox' aria-label={'helm'} name={'helm'} checked={!!hasHelm} onChange={(e) => setHasHelm(e.target.checked ? 1 : 0)} />
          </div>

        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <StatDial stat={ath} natStat={ath} setStat={setAth} title={'Atletismo'} />
          <StatDial stat={melee} natStat={melee} setStat={setMelee} title={'Corpo'} />
          <StatDial stat={ranged} natStat={ranged} setStat={setRanged} title={'Distância'} />
          <StatDial stat={edu} natStat={edu} setStat={setEdu} title={'Educação'} />
          <StatDial stat={cast} natStat={cast} setStat={setCast} title={'Feitiçaria'} />
          <StatDial stat={convic} natStat={convic} setStat={setConvic} title={'Convicção'} />
          <StatDial stat={subt} natStat={subt} setStat={setSubt} title={'Subterfúgio'} />
        </div>

        <h2 className='text-xl'>Perícias</h2>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'strike'} statName='strike' calculatedValue={Math.floor((AGI+PER)/2) + melee - 2*MH} title={'Golpear'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'precision'} statName='precision' calculatedValue={PER + ranged - 2*MH - 3*hasGauntlets} title={'Precisão**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'evasion'} statName='evasion' calculatedValue={Math.floor((AGI+PER)/2 - 2*MH) + melee -gearPen} title={'Evasão*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'reflex'} statName='reflex' calculatedValue={Math.floor((AGI+PER)/2 - 2*MH- 3*hasHelm) + ranged-gearPen} title={'Reflexos*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'block'} statName='block' calculatedValue={Math.floor((AGI+PER)/2 - 2*MH) + melee} title={'Bloquear'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'grapple'} statName='grapple' calculatedValue={Math.floor((STR+PER)/2 + 5*MH) + melee} title={'Agarrar'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'balance'} statName='balance' calculatedValue={Math.floor((AGI+STR)/2)} title={'Equilíbrio'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'climb'} statName='climb' calculatedValue={Math.floor((AGI+STR)/2)- 3*MH-3*hasGauntlets-gearPen} title={'Escalar*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'strength'} statName='strength' calculatedValue={STR + 5*MH} title={'Força'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'sneak'} statName='sneak' calculatedValue={Math.floor((AGI+PER)/2)- 3*MH-gearPen} title={'Furtividade'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'prestidigitation'} statName='prestidigitation' calculatedValue={Math.floor((AGI+PER)/2)-3*hasGauntlets} title={'Prestidigitação**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'health'} statName='health' calculatedValue={CON} title={'Saúde'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'swim'} statName='swim' calculatedValue={Math.floor((AGI+CON)/2)-gearPen-3*hasHelm} title={'Nadar*'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'spellcast'} statName='spellcast' calculatedValue={Math.floor((POW+INT)/2) + cast} title={'Feitiçaria'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'knowledge'} statName='knowledge' calculatedValue={INT + edu} title={'Conhecimento'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'explore'} statName='explore' calculatedValue={Math.floor((INT+PER)/2)} title={'Explorar'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'detect'} statName='detect' calculatedValue={PER-3*hasHelm} title={'Detecção***'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'sense'} statName='sense' calculatedValue={Math.floor((POW+PER)/2) + cast} title={'Sentir'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'cunning'} statName='cunning' calculatedValue={Math.floor((INT+PER)/2-3*hasHelm) + subt} title={'Astúcia***'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'will'} statName='will' calculatedValue={POW + convic} title={'Vontade'}  skills={skills} setSkills={setSkills}/>
        </div>

        <textarea aria-label='notes' className='border rounded p-1 min-h-32' onChange={val => setNotes(val.target.value)} value={notes} />
        
        <button type='button' className='border rounded p-2' onClick={handleSaveCharacterClick}>Save</button>
      </div>
      <div className='flex flex-col text-center md:col-span-5  items-center mx-2 gap-2'>
        <ArmorPanel RESnat={RESnat} INSnat={INSnat} TENnat={TENnat} scaledArmor={scaledArmor} />
        <WeaponPanel characterWeapons={characterWeapons} setCharacterWeapons={setCharacterWeapons} STR={STR}/>
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
                onClick={() => handleDeleteCharacterClick(name)}
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

  const [bonus, setBonus] = useState(skills[statName]-calculatedValue)
  const val = skills[statName]

  useEffect(()=>{
    if(val != calculatedValue+bonus){
      setSkills((prev)=> ({...prev,  [statName]: calculatedValue+bonus}))
    }
  }, [calculatedValue])

  useEffect(()=>{
    if(val != calculatedValue+bonus){
      setBonus(val-calculatedValue)
    }
  }, [val])


  return(
    <div className='flex flex-col w-10 md:w-16 overflow-hidden'>
      <label>{title.slice(0,10)}</label>
      <input className='p-1 border border-white rounded w-10 md:w-16 text-center' title={title} type='number' inputMode="numeric" value={val} onChange={(e) => setSkills({...skills, [statName]:parseInt(e.target.value)})} />
      <button type='button' className='text-xs bg-gray-800 border' onClick={() => setSkills({...skills, [statName]: calculatedValue})}>Reset</button>
    </div>
  )
}

const StatDial = ({natStat, stat, setStat, title}:{natStat: number, stat: number, setStat: React.Dispatch<React.SetStateAction<number>>, title: string}) => {
  const [val, setVal] = useState(stat+'')

  return(
    <div className='flex flex-col w-10 md:w-16 overflow-hidden'>
      <label>{title}</label>
      <input className='p-1 border border-white rounded w-10 md:w-16 text-center' title={title} type='number' inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => setStat((isNaN(parseInt(val)) ? 0 :parseInt(val))-stat+natStat)} />
    </div>
  )
}

const TextItem = ({stat, setStat, title}:{stat: string, setStat: (val:string) => void, title: string}) => {
  const [val, setVal] = useState(stat)

  return(
    <div className='flex flex-col w-20 md:w-20 overflow-hidden justify-center align-center content-center text-center'>
      <label>{title}</label>
      <input className='p-1 border border-white rounded w-16 text-center' title={title} type='text'  value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => setStat(val)} />
    </div>
  )
}