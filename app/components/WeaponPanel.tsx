'use client'

import { WeaponType } from "../types";

export function WeaponPanel({characterWeapons, setCharacterWeapons, STR=10}:{characterWeapons: {[key:string]: WeaponType}, setCharacterWeapons?: React.Dispatch<React.SetStateAction<{[key:string]: WeaponType}>>, STR:number }){

  return(
    <div className='flex flex-col justify-center w-84 md:w-full'>
          {
            Object.entries(characterWeapons).map(([key, el]) => {
              
              return(
                <div key={key} className='flex flex-col justify-center border rounded p-1'>
                  <div className='flex flex-row gap-3' >
                    <span>Arma: {key} </span>
                    <span>tipo: {el.handed} </span>
                    {
                      setCharacterWeapons ?
                      <>
                        <span>Tamanho: {el.scale}</span>
                        <input type='button' value='unequip' onClick={() => { const {[key]: _ , ...rest } = characterWeapons; setCharacterWeapons(rest)}} className='border rounded p-1' />
                      </> :
                      null
                    }
                  </div>
                  <table className='md:w-full text-center text-xs'>
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
                            <td>{atk.impact+(atk.heavyMod ? '+'+ Math.floor(atk.heavyMod*STR) : '') + '/' +Math.floor(atk.impact*atk.penMod)+(atk.heavyMod ? '+'+Math.floor(atk.heavyMod*atk.penMod*STR) : '')}</td>
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
