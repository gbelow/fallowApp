'use client'
import { useEffect, useMemo, useState } from 'react'
import bus from "./eventBus";
import armors from './armors.json'
import weapons from './weapons.json'
import charactersList from './characters.json'
import baseCharacter from './baseCharacter.json'

const MHArr = [-2,-1,0,1,2,3,4]
const dmgArr = [0.5, 0.75, 1, 1.5, 2, 3, 4]

export const skillsList = {
  strike: 10,
  block: 10,
  evasion: 10,
  reflex: 10,
  precision: 10,
  grapple: 10,
  sneak: 10,
  prestidigitation: 10,
  balance: 10,
  strength: 10,
  health: 10,
  swim: 10,
  climb: 10,
  knowledge: 10,
  spellcast: 10,
  detect: 10,
  sense: 10,
  explore: 10,
  will: 10,
  cunning: 10,
}

const baseArmor = Object.values(armors)[0]
const baseWeapon = Object.values(weapons)[0]



export type ArmorType = typeof baseArmor
export type WeaponType = typeof baseWeapon
export type CharacterType = typeof baseCharacter

export type WeaponList = typeof weapons
export type SkillsList = typeof skillsList
export type SkillsListKeys = keyof typeof skillsList

export function CharacterCreator() {

  const [name, setName] = useState('')

  
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

  const [skills, setSkills] = useState(skillsList) 
  const [armor, setArmor] = useState(baseArmor) 
  const [scaledArmor, setScaledArmor] = useState(baseArmor) 
  const [characterWeapons, setCharacterWeapons] = useState({[baseWeapon.name]:baseWeapon}) 

  const [notes, setNotes ] = useState('')

  const saveCharacter = () => {
    const character = {
      name,
      size, 
      attributes:{STR, AGI, CON, INT, POW, PER},
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

    console.log(character)
  }

  const loadCharacter = (payload: {character: CharacterType}) => {
    console.log(payload.character)

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

  const StatDial = ({natStat, stat, setStat, title}:{natStat: number, stat: number, setStat: React.Dispatch<React.SetStateAction<number>>, title: string}) => {

    return(
      <div className='flex flex-col'>
        <label>{title}</label>
        <input className='p-1 border border-white rounded w-16 text-center' title={title} type='number' value={stat} onChange={(e) => setStat(parseInt(e.target.value)-stat+natStat)} />
      </div>
    )
  }

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
    <div className='grid grid-cols-12 w-full'>
      <div className='col-span-7 flex flex-col gap-2 text-sm'>
        <div>
          <button className='border p-2 rounded' onClick={resetAll}>Reset</button>
        </div>
          <div className='flex flex-col'>
            <label htmlFor="name">Nome</label>
            <input id='name' className='border rounded' type='text' value={name} onChange={(e)=> setName(e.target.value)} />
          </div>
        <div className='flex flex-row gap-4'>
          <div>PA: {AGI-(armor.type == "medium" ? 1 : armor.type == "heavy" ? 2 : 0)}</div>
          <div>STA: {CON-(armor.type == "medium" ? 1 : armor.type == "heavy" ? 2 : 0)}</div>
          <div>STA regen: {Math.floor(CON/3)}</div>
          <div>Ferimentos leves: {Math.floor(CON/2)}</div>
          <div>Ferimentos sérios: {Math.floor(CON/5)}</div>
        </div>
        <div className='flex flex-row gap-4'>
          <StatDial stat={STR} natStat={natSTR} setStat={setNatSTR} title={'Força'} />
          <StatDial stat={AGI} natStat={natAGI} setStat={setNatAGI} title={'Agilidade'} />
          <StatDial stat={CON} natStat={natCON} setStat={setNatCON} title={'Constituição'} />
          <StatDial stat={INT} natStat={natINT} setStat={setNatINT} title={'Inteligência'} />
          <StatDial stat={POW} natStat={natPOW} setStat={setNatPOW} title={'Poder'} />
          <StatDial stat={PER} natStat={natPER} setStat={setNatPER} title={'Percepção'} />
        </div>
        <div className='flex flex-row gap-4'>
          <StatDial stat={size} natStat={size} setStat={setSize} title={'Tamanho'} />
          <StatDial stat={RESnat} natStat={RESnat} setStat={setRESnat} title={'RES nat'} />
          <StatDial stat={TENnat} natStat={TENnat} setStat={setTENnat} title={'TEN nat'} />
          <StatDial stat={INSnat} natStat={INSnat} setStat={setINSnat} title={'INS nat'} />
          <StatDial stat={gearPen} natStat={gearPen} setStat={setGearPen} title={'Gear PEN'} />
          <div className='flex flex-col'>
            <label>tem manoplas</label>
            <input type='checkbox' aria-label={'gaunt'} name={'gaunt'} checked={!!hasGauntlets} onChange={(e) => setHasGauntlets(e.target.checked ? 1 : 0)} />
          </div>
          <div className='flex flex-col'>
            <label>tem capacete</label>
            <input type='checkbox' aria-label={'helm'} name={'helm'} checked={!!hasHelm} onChange={(e) => setHasHelm(e.target.checked ? 1 : 0)} />
          </div>

        </div>
        <div className='flex flex-row gap-4'>
          <StatDial stat={ath} natStat={ath} setStat={setAth} title={'Atletismo'} />
          <StatDial stat={melee} natStat={melee} setStat={setMelee} title={'Corpo a corpo'} />
          <StatDial stat={ranged} natStat={ranged} setStat={setRanged} title={'Distância'} />
          <StatDial stat={edu} natStat={edu} setStat={setEdu} title={'Educação'} />
          <StatDial stat={cast} natStat={cast} setStat={setCast} title={'Feitiçaria'} />
          <StatDial stat={convic} natStat={convic} setStat={setConvic} title={'Convicção'} />
          <StatDial stat={subt} natStat={subt} setStat={setSubt} title={'Subterfúgio'} />
        </div>

        <h2 className='text-xl'>Perícias</h2>
        <div className='flex flex-row gap-2'>
          <SkillItem key={skey+'strike'} statName='strike' calculatedValue={Math.floor((AGI+PER)/2) + melee - 2*MH} title={'Golpear'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'precision'} statName='precision' calculatedValue={PER + ranged - 2*MH - 3*hasGauntlets} title={'Precisão**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'evasion'} statName='evasion' calculatedValue={Math.floor((AGI+PER)/2 - 2*MH) + melee -gearPen} title={'Evasão*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'reflex'} statName='reflex' calculatedValue={Math.floor((AGI+PER)/2 - 2*MH- 3*hasHelm) + ranged-gearPen} title={'Reflexos*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'block'} statName='block' calculatedValue={Math.floor((AGI+PER)/2 - 2*MH) + melee} title={'Bloquear'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'grapple'} statName='grapple' calculatedValue={Math.floor((STR+PER)/2 + 5*MH) + melee} title={'Agarrar'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2'>
          <SkillItem key={skey+'balance'} statName='balance' calculatedValue={Math.floor((AGI+STR)/2)} title={'Equilíbrio'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'climb'} statName='climb' calculatedValue={Math.floor((AGI+STR)/2)- 3*MH-3*hasGauntlets-gearPen} title={'Escalar*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'strength'} statName='strength' calculatedValue={STR + 5*MH} title={'Força*'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'sneak'} statName='sneak' calculatedValue={Math.floor((AGI+PER)/2)- 3*MH-gearPen} title={'Furtividade'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'prestidigitation'} statName='prestidigitation' calculatedValue={Math.floor((AGI+PER)/2)-3*hasGauntlets} title={'Prestidigitação**'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'health'} statName='health' calculatedValue={CON} title={'Saúde'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'swim'} statName='swim' calculatedValue={Math.floor((AGI+CON)/2)-gearPen-3*hasHelm} title={'Nadar*'}  skills={skills} setSkills={setSkills}/>
        </div>
        <div className='flex flex-row gap-2'>
          <SkillItem key={skey+'spellcast'} statName='spellcast' calculatedValue={Math.floor((POW+INT)/2) + cast} title={'Feitiçaria'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'knowledge'} statName='knowledge' calculatedValue={INT + edu} title={'Conhecimento'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'explore'} statName='explore' calculatedValue={Math.floor((INT+PER)/2)} title={'Explorar'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'detect'} statName='detect' calculatedValue={PER-3*hasHelm} title={'Detecção***'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'sense'} statName='sense' calculatedValue={Math.floor((POW+PER)/2) + cast} title={'Sentir'} skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'cunning'} statName='cunning' calculatedValue={Math.floor((INT+PER)/2-3*hasHelm) + subt} title={'Astúcia***'}  skills={skills} setSkills={setSkills}/>
          <SkillItem key={skey+'will'} statName='will' calculatedValue={POW + convic} title={'Vontade'}  skills={skills} setSkills={setSkills}/>
        </div>

        <textarea aria-label='notes' className='border rounded p-1 min-h-32' onChange={val => setNotes(val.target.value)} value={notes} />
        
        <button type='button' className='border rounded p-2' onClick={saveCharacter}>Save</button>
      </div>
      <div className='col-span-5 flex flex-col items-center mx-2'>
        <ArmorPanel RESnat={RESnat} INSnat={INSnat} TENnat={TENnat} scaledArmor={scaledArmor} />
        <WeaponPanel characterWeapons={characterWeapons} setCharacterWeapons={setCharacterWeapons}/>
      </div>
    </div>
  )
}

function ArmorPanel({scaledArmor, RESnat, TENnat, INSnat}: {scaledArmor: ArmorType, RESnat: number, TENnat: number, INSnat: number}){
  return(
    <>
      <div>Armor: {scaledArmor.name}</div>
        <table className='w-full text-center'>
          <thead>
            <tr >
              <th></th>
              <th>PROT</th>
              <th>TEN</th>
              <th>INS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>armadura</td>
              <td>{ scaledArmor.prot}</td>
              <td>{ scaledArmor.TEN}</td>
              <td>{ scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>leve</td>
              <td>{RESnat + scaledArmor.prot}</td>
              <td>{TENnat + scaledArmor.TEN}</td>
              <td>{INSnat + scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>sério</td>
              <td>{RESnat*2 + scaledArmor.prot}</td>
              <td>{TENnat*2 + scaledArmor.TEN}</td>
              <td>{INSnat*2 + scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>mortal</td>
              <td>{RESnat*3 + scaledArmor.prot}</td>
              <td>{TENnat*3 + scaledArmor.TEN}</td>
              <td>{INSnat*3 + scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>súbito</td>
              <td>{RESnat*6 + scaledArmor.prot}</td>
              <td>{TENnat*6 + scaledArmor.TEN}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className='flex gap-2 text-center justify-center'>
          <span>RES {scaledArmor.RES}</span>
          <span>Penal {scaledArmor.penalty}</span>
          <span>Cobertura {scaledArmor.cover}</span>
        </div>
    </>
  )
}

function scaleArmor(armor: ArmorType, scale: number){
  const arm = {...armor, RES: Math.floor(armor.RES*dmgArr[scale-1]), TEN: Math.floor(armor.TEN*dmgArr[scale-1]), INS: Math.floor(armor.INS*dmgArr[scale-1]), prot:Math.floor( armor.prot*dmgArr[scale-1])}  
  return arm
}

function scaleWeapon(weapon: WeaponType, scale: number){
    const weap = {...weapon, scale, attacks: weapon.attacks.map(el => ({...el, impact: Math.floor(el.impact*dmgArr[scale-1]), RES: Math.floor(el.RES*dmgArr[scale-1]), TEN: Math.floor(el.TEN*dmgArr[scale-1])}))}
    return weap
}


function WeaponPanel({characterWeapons, setCharacterWeapons}:{characterWeapons: {[key:string]: WeaponType}, setCharacterWeapons?: React.Dispatch<React.SetStateAction<{[key:string]: WeaponType}>> }){

  return(
    <div className=' w-full'>
          {
            Object.entries(characterWeapons).map(([key, el]) => {
              
              return(
                <div key={key} className='border rounded p-1'>
                  <div className='flex flex-row gap-3' >
                    <span>Arma: {key} </span>
                    <span>tipo: {el.handed} </span>
                    {
                      setCharacterWeapons ?
                      <>
                        {/* <input aria-label={key} type='number' value={el.scale} onChange={
                          (val) => { 
                            const weap = scaleWeapon(weapons[typedKey], parseInt(val.target.value))
                            setCharacterWeapons(weap ? {...characterWeapons, [key]: weap } : characterWeapons)
                          }
                        } className='border rounded p-1 w-12' /> */}
                        <span>Tamanho: {el.scale}</span>
                        <input type='button' value='unequip' onClick={() => { const {[key]: _ , ...rest } = characterWeapons; setCharacterWeapons(rest)}} className='border rounded p-1' />
                      </> :
                      null
                    }
                  </div>
                  <table className='w-full text-center'>
                    <thead>
                      <tr>
                        <td>RES</td>
                        <td>TEN</td>
                        <td>impact/PEN</td>
                        <td>PA</td>
                        <td>alcance</td>
                        <td>propriedades</td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        el.attacks.map((atk, index) => 
                          <tr key={el+index.toString()}>
                            <td>{atk.RES}</td>
                            <td>{atk.TEN}</td>
                            <td>{atk.impact+ '/' +Math.floor(atk.impact*atk.penMod)}</td>
                            <td>{atk.PA}</td>
                            <td>{atk.range}</td>
                            <td>{atk.props}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              )
            })
          }
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
    <div className='flex flex-col'>
      <label>{title.slice(0,10)}</label>
      <input className='p-1 border border-white rounded w-16 text-center' title={title} type='number' value={val} onChange={(e) => setSkills({...skills, [statName]:parseInt(e.target.value)})} />
      <button type='button' className='text-xs bg-gray-800 border' onClick={() => setSkills({...skills, [statName]: calculatedValue})}>Reset</button>
    </div>
  )
}

export function ArmorSelector(){

  const handleEquipArmorClick = (armor: ArmorType) => {
    bus.emit("equip-armor", { armor });
  };

  return(
    <div className='text-center'>
      {
        Object.values(armors).map(el => {
          return(
            <input type={'button'} key={el.name} className='text-center w-full hover:bg-gray-500 p-1 ' value={el.name} aria-label={el.name} onDoubleClick={() => handleEquipArmorClick(el)}/>
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
              <input type={'button'}  className='text-center  hover:bg-gray-500 p-1 w-32' value={el.name} aria-label={el.name} onDoubleClick={() => el ? handleEquipWeaponClick(scaleWeapon(el, el.scale)): null}/>
              <input className='w-8' type='number' aria-label={el.name} value={el.scale} onChange={(val) => setSWeapons({...sWeapons, [el.name]: {...el, scale: val.target.value}})} />
            </div>
          )
        })
      }

    </div>
  )
}



export function CharacterSelector(){

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  
  const handleSelectCharacterClick = (character: CharacterType) => {
    bus.emit("select-character", { character });
  };

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gray-900 text-white p-2">
      {Object.entries(charactersList).map(([topKey, sub]) => (
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
              {Object.entries(sub).map(([midKey, chars]) => (
                <div key={midKey} className="mb-1">
                  {/* Second level */}
                  <button
                    onClick={() => toggle(`${topKey}-${midKey}`)}
                    className="w-full text-left font-semibold p-1 bg-gray-700 rounded"
                  >
                    {midKey}
                  </button>
                  {open[`${topKey}-${midKey}`] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {Object.entries(chars).map(([charKey, charVal]) => {
                        const val = charVal as CharacterType
                        return(
                          <div
                            key={charKey}
                            className="p-1 bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
                          >
                            <input type={'button'} key={charKey} className='text-center w-full hover:bg-gray-500 p-1 ' value={charKey} aria-label={charKey} onDoubleClick={() => handleSelectCharacterClick(val)}/>
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
    </div>
  );
}

export function Sidebar(){

  const [selectedSidebar, setSelectedSidebar] = useState('') 

  return(
    <div className='h-full '>
      <div className='flex flex-row items-start justify-between mb-2 '>
        <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedSidebar == 'Armor' ? 'bg-white text-black' : '')} type={'button'} aria-label={'sbar_armor'} value={'Armor'} onClick={() => setSelectedSidebar('Armor')}/>
        <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedSidebar == 'Weapon' ? 'bg-white text-black' : '')} type={'button'} aria-label={'sbar_weapon'} value={'Weapon'} onClick={() => setSelectedSidebar('Weapon')}/>
        <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedSidebar == 'Character' ? 'bg-white text-black' : '')} type={'button'} aria-label={'sbar_char'} value={'Character'} onClick={() => setSelectedSidebar('Character')}/>
      </div>
      {
        selectedSidebar == 'Armor' ?
        <ArmorSelector /> :
        selectedSidebar == 'Weapon' ?
        <WeaponSelector /> :
        selectedSidebar == 'Character' ?
        <CharacterSelector />
        : null
      }
    </div>
  )
}


export function App(){

  const [selectedPage, setSelectedPage] = useState('Play') 

  return(
    <>      
      <header className="py-4 h-12">
        <div className='flex flex-row justify-start items-start text-start'>
          {/* <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedPage == 'Select' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_select'} value={'Select'} onClick={() => setSelectedPage('Select')}/> */}
          <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedPage == 'Character' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_char'} value={'Character'} onClick={() => setSelectedPage('Character')}/>
          <input className={'p-1 w-full hover:bg-gray-500 '+ (selectedPage == 'Play' ? 'bg-white text-black' : '')} type={'button'} aria-label={'head_play'} value={'Play'} onClick={() => setSelectedPage('Play')}/>
        </div>
      </header>
      <main className="grid grid-cols-12 w-full h-full">
      <div className="col-span-2 border pr-1 px-1 h-full">
        <Sidebar />
      </div>
      <div className="col-span-10 px-4">
        {
          selectedPage == 'Character' ?
            <CharacterCreator /> :
            selectedPage == 'Play' ?
            <PlayPanel /> :
            null
        }
      </div>
      </main>
    </>
  )
}

type AfflictionItemType = {
  isActive: boolean, 
  mobility?: number,
  vision?:number,
  mental?: number,
  health?:number,
}

const afflictions: {[key:string]: AfflictionItemType} = {
  prone: {isActive: false, mobility: 3},
  grappled: {isActive: false, mobility: 3},
  immobile: {isActive: false, mobility: 3},
  limp: {isActive: false, mobility: 3},

  dazzled: {isActive: false, vision: 2},
  blind: {isActive: false, vision: 5},

  fear: {isActive: false, mental: 2},
  rage: {isActive: false, mental: 2},
  confused: {isActive: false, mental: 3},
  seduced: {isActive: false, },
  distracted: {isActive: false, },
  dominated: {isActive: false, },
}
type Afflictionstype = typeof afflictions


const charResources = {fightName: '', PA:0, STA:0, injuries:{light:[0], mid:[0], dead:[0]}, penalties:{mobility:0, injury:0, health:0, mental:0, vision: 0}, equippedWeapons:{}, turn:0, turnToken:true, isPlaying: false, skills: baseCharacter.skills, afflictions}
type CharResourcestype = typeof charResources

const penaltyTable = {
  mobility: [
    "strike",
    "block",
    "evasion",
    "reflex",
    "precision",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
  ],
  injury:[
    "strike",
    "block",
    "evasion",
    "reflex",
    "precision",
    "grapple",
    "sneak",
    "prestidigitation",
    "balance",
    "strength",
    "swim",
    "climb",
  ],
  vision:[
    "strike",
    "block",
    "evasion",
    "reflex",
    "precision",
    "grapple",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
    "detect",
    "explore",
    "cunning"
  ],
  mental:[
    "strike",
    "reflex",
    "precision",
    "sneak",
    "prestidigitation",
    "balance",
    "climb",
    "knowledge",
    "spellcast",
    "detect",
    "sense",
    "explore",
    "will",
    "cunning"
  ],
  health:[
    "health"
  ]
}

type ActiveCharType = CharacterType & {
  resources: CharResourcestype
}

function PlayPanel(){

  const [characters, setCharacters] = useState<{[key:string]:ActiveCharType}>({})

  const [currentCharacter, setCurrentCharacter] = useState<ActiveCharType>()

  const [roundCounter, setRoundCounter] = useState(1)
  const [turnCounter, setTurnCounter] = useState(1)
  const [dice10, setDice10] = useState(1)
  const [dice6, setDice6] = useState(1)

  const updateResource = (rssName: string, value: any) => {
    setCurrentCharacter((prev) => (prev ? {...prev, resources: {...prev?.resources, [rssName]: value }} : undefined))
  }

  const updateInjury = (val:number, ind:number, type: 'light' | 'mid' | 'dead') => {
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
      setCharacters({...characters, [newName]: 
        {
          ...char, 
          resources: {
            ...charResources, 
            fightName: newName, 
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
      })
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
  }, [characters, currentCharacter]);

  const startTurn = () => {
    if(currentCharacter?.resources.turnToken){
      const charKeys = Object.keys(characters)
      const newChars = {...characters}
      charKeys.forEach(el => newChars[el].resources.isPlaying = false)
      newChars[currentCharacter?.resources.fightName].resources.isPlaying = true
      newChars[currentCharacter?.resources.fightName].resources.turnToken = false
      newChars[currentCharacter?.resources.fightName].resources.turn = turnCounter  
      setCharacters(newChars)
      setCurrentCharacter({...currentCharacter, resources: {...currentCharacter.resources, isPlaying: true, turnToken: false, turn: turnCounter, PA: Math.min(currentCharacter.resources.PA+currentCharacter.attributes.AGI, currentCharacter.attributes.AGI)}})
      setTurnCounter(turnCounter+1)
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

  const updatePenalty = (value: number, name: string) => {
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
      // updateResource('afflictions', newAfflictions )
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
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between mb-4'>
        <div className='flex flex-row gap-2 w-full overflow-auto p-3'>
          {
            Object.entries(characters).map(([key, value]) => 
              <input className={'p-2 border h-12  '+(value.resources.isPlaying ? 'bg-gray-500' : value.resources.turnToken ? 'bg-blue-400' : '')} type='button' value={key} aria-label={key} key={key} onClick={() => {
                setCurrentCharacter((prev) => { prev ? setCharacters({...characters, [prev.resources.fightName]: prev}) : null; return value})
              }}/>
            )
          }
        </div>
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
      </div>
      {
        currentCharacter ?
        <div className='grid grid-cols-12 w-full'>
          <div className='col-span-7 flex flex-col gap-2 text-sm'>
          <div className='flex gap-2'>
            <input type='button' value='d10' aria-label='roll' className='p-1 border hover:bg-gray-500 rounded' onClick={() => setDice10(Math.floor(Math.random() * 10) + 1)}/>
            <span>
              Rolagem: {dice10}
            </span>
            <input type='button' value='d6' aria-label='roll' className='p-1 border hover:bg-gray-500 rounded' onClick={() => setDice6(Math.floor(Math.random() * 6) + 1)}/>
            <span>
              Rolagem: {dice6}
            </span>
            <input type='button' value='startTurn' aria-label='startTurn' className='p-1 border hover:bg-gray-500 rounded' onClick={startTurn } />  
            <span className='text-lg'>Ordem no turno {currentCharacter.resources.turn}</span>
          </div>
                         
            <div className='flex flex-row gap-2'>
              <span className='text-lg'>{currentCharacter.resources.fightName}</span>
              <SimpleResource value={currentCharacter.resources.PA} name={'PA'} setRss={(val) => updateResource('PA', val)}/>
              <SimpleResource value={currentCharacter.resources.STA} name={'STA'} setRss={(val) => updateResource('STA', val)}/>
            </div>
            <div className='flex flex-row gap-1'>
              <span>Leves</span>
              {
                currentCharacter.resources.injuries.light.map((inj, ind) => <Injury key={ind} cures={inj} type='light' setRss={(val) => updateInjury(val, ind, 'light')} />)
              }
            </div>
            <div className='flex flex-row gap-1'>
              <span>Sérios</span>
              {
                currentCharacter.resources.injuries.mid.map((inj, ind) => <Injury key={ind} cures={inj} type='mid' setRss={(val) => updateInjury(val, ind, 'mid')} />)
              }
            </div>
            <div className='flex flex-row gap-1'>
              <span>Mortais</span>
              {
                currentCharacter.resources.injuries.dead.map((inj, ind) => <Injury key={ind} cures={inj} type='dead' setRss={(val) => updateInjury(val, ind, 'dead')} />)
              }
              <input type='button' value='KILL' aria-label='kill' className='p-1 border hover:bg-gray-500 rounded' onClick={killCharacter} />

            </div>
            <div className='flex flex-row gap-2'>
              <SimpleSkill name={'Mobility'} value={currentCharacter.resources.penalties.mobility}/>
              {/* <SimpleResource value={currentCharacter.resources.penalties.mobility} name={'mobility'} setRss={(val) => updatePenalty(val, 'mobility')}/> */}
              <SimpleResource value={currentCharacter.resources.penalties.injury} name={'injury'} setRss={(val) => updatePenalty(val, 'injury')}/>
              <SimpleSkill name={'Vision'} value={currentCharacter.resources.penalties.vision}/>
              <SimpleSkill name={'Mental'} value={currentCharacter.resources.penalties.mental}/>
              {/* <SimpleResource value={currentCharacter.resources.penalties.vision} name={'vision'} setRss={(val) => updatePenalty(val, 'vision')}/> */}
              {/* <SimpleResource value={currentCharacter.resources.penalties.mental} name={'mental'} setRss={(val) => updatePenalty(val, 'mental')}/> */}
              <SimpleSkill name={'Health'} value={currentCharacter.resources.penalties.health}/>
              {/* <SimpleResource value={currentCharacter.resources.penalties.health} name={'health'} setRss={(val) => updatePenalty(val, 'health')}/> */}
            </div>
            <div className='flex flex-row gap-2'>
              <SimpleSkill name={'FOR'} value={currentCharacter.attributes.STR}/>
              <SimpleSkill name={'AGI'} value={currentCharacter.attributes.AGI}/>
              <SimpleSkill name={'CON'} value={currentCharacter.attributes.CON}/>
              <SimpleSkill name={'INT'} value={currentCharacter.attributes.INT}/>
              <SimpleSkill name={'POW'} value={currentCharacter.attributes.POW}/>
              <SimpleSkill name={'PER'} value={currentCharacter.attributes.PER}/>
            </div>
            <h2 className='text-xl'>Perícias</h2>
            <div className='flex flex-row gap-2'>
              <SimpleSkill name={'strike'} value={currentCharacter.resources.skills['strike']}/>
              <SimpleSkill name={'precision'} value={currentCharacter.resources.skills['precision']}/>
              <SimpleSkill name={'evasion'} value={currentCharacter.resources.skills['evasion']}/>
              <SimpleSkill name={'reflex'} value={currentCharacter.resources.skills['reflex']}/>
              <SimpleSkill name={'block'} value={currentCharacter.resources.skills['block']}/>
              <SimpleSkill name={'grapple'} value={currentCharacter.resources.skills['grapple']}/>
              <SimpleSkill name={'DP'} value={8-MHArr[(currentCharacter.size-1) ?? 3]*2}/>
            </div>
            <div className='flex flex-row gap-2'>
              <SimpleSkill name={'balance'} value={currentCharacter.resources.skills['balance']}/>
              <SimpleSkill name={'climb'} value={currentCharacter.resources.skills['climb']}/>
              <SimpleSkill name={'strength'} value={currentCharacter.resources.skills['strength']}/>
              <SimpleSkill name={'sneak'} value={currentCharacter.resources.skills['sneak']}/>
              <SimpleSkill name={'prestidigitation'} value={currentCharacter.resources.skills['prestidigitation']}/>
              <SimpleSkill name={'health'} value={currentCharacter.resources.skills['health']}/>
              <SimpleSkill name={'swim'} value={currentCharacter.resources.skills['swim']}/>
            </div>
            <div className='flex flex-row gap-2'>
              <SimpleSkill name={'spellcast'} value={currentCharacter.resources.skills['spellcast']}/>
              <SimpleSkill name={'knowledge'} value={currentCharacter.resources.skills['knowledge']}/>
              <SimpleSkill name={'explore'} value={currentCharacter.resources.skills['explore']}/>
              <SimpleSkill name={'detect'} value={currentCharacter.resources.skills['detect']}/>
              <SimpleSkill name={'sense'} value={currentCharacter.resources.skills['sense']}/>
              <SimpleSkill name={'cunning'} value={currentCharacter.resources.skills['cunning']}/>
              <SimpleSkill name={'spellcast'} value={currentCharacter.resources.skills['spellcast']}/>
            </div>
            <textarea aria-label='notes' className='border rounded p-1 min-h-32' value={currentCharacter.notes} readOnly/>
          </div>
          <div className='col-span-5 flex flex-col gap-2 text-sm'>
            <AfflictionsPannel afflictions={currentCharacter.resources.afflictions} setAfflictions={setAfflictions} />
            <ArmorPanel RESnat={currentCharacter.RESnat} INSnat={currentCharacter.INSnat} TENnat={currentCharacter.TENnat} scaledArmor={scaleArmor(currentCharacter.armor, currentCharacter.size)} />
            <div className='flex flex-row gap-2 text-center justify-center'>
              <SimpleSkill name={'RES nat'} value={currentCharacter.RESnat}/>
              <SimpleSkill name={'TEN nat'} value={currentCharacter.TENnat}/>
              <SimpleSkill name={'INS nat'} value={currentCharacter.INSnat}/>
            </div>
            <WeaponPanel characterWeapons={currentCharacter.resources.equippedWeapons} setCharacterWeapons={(val)=> updateResource('equippedWeapons', val)} />
          </div>
        </div>
        : null
      }
    </div>
  )
}

function Injury({cures, setRss, type}: {cures: number, type:string, setRss: (val:any) => void }){
  const step = type == 'light' ? 2 : type == 'mid' ? 10 : type == 'dead' ? 20 : 1
  return(
    <div className={'flex flex-col border rounded-full text-center p-1 w-12 h-12 text-center items-center justify-center '+(cures>0 ? 'bg-red-600' : null)}>
      <input className='w-12 text-center' type='number' aria-label={'injury'} value={cures} onChange={(val) => setRss(val.target.value)} />
      <input type='button' aria-label={'causeInjury'} value={'+'} onClick={() => setRss(step)} />
    </div>
  )
}

function SimpleResource({name, value, setRss}: {name: string, value: number, setRss: (val:any) => void }){

  return(
    <div className='flex flex-col border rounded text-center p-1 w-20'>
      <span>{name.slice(0,10)}</span>
      <input type='number' aria-label={name} value={value} onChange={(val) => setRss(val.target.value)} />
    </div>
  )
}

function SimpleSkill({name, value}: {name: string, value: number}){

  return(
    <div className='flex flex-col border rounded text-center p-1 w-20'>
      <span>{name.slice(0,10)}</span>
      <span>{value}</span>
    </div>
  )
}



function AfflictionsPannel({afflictions , setAfflictions}: {afflictions: Afflictionstype, setAfflictions: (key:string, val:AfflictionItemType) => void }){

  return(
    <div className='flex flex-row w-full flex-wrap gap-2'>
      {
        Object.entries(afflictions).map(([key, el]) => 
          <input key={key} className={'border p-1 ' + (el.isActive ? 'bg-red-500' : null)} type='button' aria-label={key} value={key} onClick={() => setAfflictions(key, {...el, isActive: !el.isActive})} />
        )
      }
    </div>
  )
}

