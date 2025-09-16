'use client'

import { WeaponType } from "../types";

export function WeaponPanel({characterWeapons, setCharacterWeapons}:{characterWeapons: {[key:string]: WeaponType}, setCharacterWeapons?: React.Dispatch<React.SetStateAction<{[key:string]: WeaponType}>> }){

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
