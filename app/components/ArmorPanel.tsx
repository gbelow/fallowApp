'use client'
import baseArmor from '../baseArmor.json'

export type ArmorType = typeof baseArmor
export function ArmorPanel({scaledArmor, RESnat, TENnat, INSnat}: {scaledArmor: ArmorType, RESnat: number, TENnat: number, INSnat: number}){
  return(
    <>
      <div>Armor: {scaledArmor.name}</div>
        <table className='w-84 md:w-full text-center'>
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