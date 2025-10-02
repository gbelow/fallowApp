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

  const [RESnat, setRESnat ] = useState(Math.floor(STR*MD/2))
  const [INSnat, setINSnat ] = useState(Math.floor(STR*MD/2))
  const [TENnat, setTENnat ] = useState(Math.floor(STR*MD/2))
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
    setRESnat(Math.floor(STR*MD/2))
    setTENnat(Math.floor(STR*MD/2))
    setINSnat(Math.floor(STR*MD/2))
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
          <div>PA: {6}</div>
          <div>STA: {STA}</div>
          <div>STA regen: {Math.floor(CON/3)}</div>
          <div>Ferimentos leves: {Math.floor(CON/2)}</div>
          <div>Ferimentos sérios: {Math.floor(CON/5)}</div>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <TextItem stat={movement.basic} setStat={(val)=> setMovement({...movement, basic:val})} title={'basic (1PA)'} />
          <TextItem stat={movement.careful} setStat={(val)=> setMovement({...movement, careful:val})} title={'care (1PA)'} />
          <TextItem stat={movement.crawl} setStat={(val)=> setMovement({...movement, crawl:val})} title={'crawl (1PA)'} />
          <TextItem stat={movement.run} setStat={(val)=> setMovement({...movement, run:val})} title={'run (2PA )'} />
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <TextItem stat={movement.swim} setStat={(val)=> setMovement({...movement, swim:val})} title={'swim (1PA)'} />
          <TextItem stat={movement['fast swim']} setStat={(val)=> setMovement({...movement, "fast swim":val})} title={'fast swim (1PA+1STA)'} />
          <TextItem stat={movement.jump} setStat={(val)=> setMovement({...movement, jump:val})} title={'jump (1PA+1STA)'} />
          <TextItem stat={movement.stand} setStat={(val)=> setMovement({...movement, stand:val})} title={'stand up'} />
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
          <StatDial stat={melee} natStat={melee} setStat={setMelee} title={'Corpo'} />
          <StatDial stat={ranged} natStat={ranged} setStat={setRanged} title={'Distância'} />
          <StatDial stat={detection} natStat={detection} setStat={setDetection} title={'Detecção'} />
          <StatDial stat={spellcast} natStat={spellcast} setStat={setSpellcast} title={'Feitiçaria'} />
          <StatDial stat={convic1} natStat={convic1} setStat={setConvic1} title={'Convicção1'} />
          <StatDial stat={convic2} natStat={convic2} setStat={setConvic2} title={'Convicção2'} />
        </div>

        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'strike'} statName='strike' calculatedValue={ melee - 2*MH} title={'Golpear'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'precision'} statName='precision' calculatedValue={ ranged - 2*MH - 3*hasGauntlets} title={'Precisão**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'evasion'} statName='evasion' calculatedValue={ melee - 2*MH } title={'Evasão'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'reflex'} statName='reflex' calculatedValue={ detection+ranged - 2*MH- 3*hasHelm } title={'Reflexos'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'block'} statName='block' calculatedValue={ melee - 2*MH} title={'Bloquear'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'grapple'} statName='grapple' calculatedValue={melee + 5*MH} title={'Agarrar'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'balance'} statName='balance' calculatedValue={AGI} title={'Equilíbrio'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'climb'} statName='climb' calculatedValue={AGI- 3*MH-3*hasGauntlets-gearPen} title={'Escalar*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'swim'} statName='swim' calculatedValue={AGI-gearPen-3*hasHelm} title={'Nadar*'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'strength'} statName='strength' calculatedValue={STA + 5*MH} title={'Força'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'sneak'} statName='sneak' calculatedValue={AGI- 3*MH-gearPen} title={'Furtividade'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'prestidigitation'} statName='prestidigitation' calculatedValue={DEX-3*hasGauntlets} title={'Prestidigitação**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'health'} statName='health' calculatedValue={CON} title={'Saúde'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'knowledge'} statName='knowledge' calculatedValue={2*INT} title={'Conhecimento'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'explore'} statName='explore' calculatedValue={detection} title={'Explorar'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'cunning'} statName='cunning' calculatedValue={detection-3*hasHelm} title={'Astúcia***'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'will'} statName='will' calculatedValue={0} title={'Vontade'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'enchant'} statName='enchant' calculatedValue={0} title={'Encantar'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'stress'} statName='stress' calculatedValue={0} title={'Estressar'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'devotion'} statName='devotion' calculatedValue={SPI} title={'Devoção'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          <SkillItem key={skey+'combustion'} statName='combustion' calculatedValue={+ spellcast} title={'Combustão'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'eletromag'} statName='eletromag' calculatedValue={+ spellcast} title={'Eletromag'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'radiation'} statName='radiation' calculatedValue={+ spellcast} title={'Radiação'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'enthropy'} statName='enthropy' calculatedValue={+ spellcast} title={'Entropia'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'biomancy'} statName='biomancy' calculatedValue={+ spellcast} title={'Biomancia'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'telepathy'} statName='telepathy' calculatedValue={+ spellcast} title={'Telepatia'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'animancy'} statName='animancy' calculatedValue={+ spellcast} title={'Animancia'} skills={skills} setSkills={setSkills}/>
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