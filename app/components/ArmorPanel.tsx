'use client'
import { Character } from '../domain/types'

export function ArmorPanel({character}: {character: Character}){
  return(
    <>
    <div>Armor: {character.armor.name}</div>
      <table className='w-84 md:w-full text-center'>
        <thead>
          <tr >
            <th></th>
            <th>PROT</th>
            <th>TGH</th>
            <th>INS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>armor</td>
            <td>{ character.armor.prot}</td>
            <td>{ character.armor.TGH}</td>
            <td>{ character.armor.INS}</td>
          </tr>
          <tr>
            <td>light</td>
            <td>{character.characteristics.RES + character.armor.prot}</td>
            <td>{character.characteristics.TGH + character.armor.TGH}</td>
            <td>{character.characteristics.INS + character.armor.INS}</td>
          </tr>
          <tr>
            <td>serious</td>
            <td>{character.characteristics.RES*2 + character.armor.prot}</td>
            <td>{character.characteristics.TGH*2 + character.armor.TGH}</td>
            <td>{character.characteristics.INS*2 + character.armor.INS}</td>
          </tr>
          <tr>
            <td>deadly</td>
            <td>{character.characteristics.RES*3 + character.armor.prot}</td>
            <td>{character.characteristics.TGH*3 + character.armor.TGH}</td>
            <td>{character.characteristics.INS*3 + character.armor.INS}</td>
          </tr>
          <tr>
            <td>sudden</td>
            <td>{character.characteristics.RES*6 + character.armor.prot}</td>
            <td>{character.characteristics.TGH*6 + character.armor.TGH}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className='flex gap-2 text-center justify-center'>
        <span>RES {character.armor.RES}</span>
        <span>Penal {character.armor.penalty}</span>
        <span>Coverage {character.armor.cover}</span>
      </div>
    </>
  )
}