'use client'
import baseArmor from '../baseArmor.json'

export type ArmorType = typeof baseArmor
export function ArmorPanel({scaledArmor, RESnat, TGHnat, INSnat}: {scaledArmor: ArmorType, RESnat: number, TGHnat: number, INSnat: number}){
  return(
    <>
      <div>Armor: {scaledArmor.name}</div>
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
              <td>{ scaledArmor.prot}</td>
              <td>{ scaledArmor.TGH}</td>
              <td>{ scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>light</td>
              <td>{RESnat + scaledArmor.prot}</td>
              <td>{TGHnat + scaledArmor.TGH}</td>
              <td>{INSnat + scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>serious</td>
              <td>{RESnat*2 + scaledArmor.prot}</td>
              <td>{TGHnat*2 + scaledArmor.TGH}</td>
              <td>{INSnat*2 + scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>deadly</td>
              <td>{RESnat*3 + scaledArmor.prot}</td>
              <td>{TGHnat*3 + scaledArmor.TGH}</td>
              <td>{INSnat*3 + scaledArmor.INS}</td>
            </tr>
            <tr>
              <td>sudden</td>
              <td>{RESnat*6 + scaledArmor.prot}</td>
              <td>{TGHnat*6 + scaledArmor.TGH}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className='flex gap-2 text-center justify-center'>
          <span>RES {scaledArmor.RES}</span>
          <span>Penal {scaledArmor.penalty}</span>
          <span>Coverage {scaledArmor.cover}</span>
        </div>
    </>
  )
}