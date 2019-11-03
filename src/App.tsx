import { some } from 'fp-ts/lib/Option'
import React from 'react'
import './App.css'
import { BeerCard } from './BeerCard'
import { BeerList } from './BeerList'
import { Button } from './Button'
import { Err } from './Err'
import { UnsignedIntegerInput } from './UnsignedIntegerInput'

const App: React.FC = () => {
  return (
    <div className="App">
      <Button label={some('test')} />
      <UnsignedIntegerInput
        initialValue={3}
        onChange={v => console.log('change', v)}
        onCommit={v => console.log('commit', v)}
        onRevert={(v, err) => console.log('revert', v, err)}
      />
      <BeerList
        className="BeerList"
        renderLoader={() => <div>Loading Beers...</div>}
        renderBeers={beers => (
          <>
            {beers.map(b => (
              <BeerCard key={b.id} beer={b} />
            ))}
          </>
        )}
        renderErrors={errors => (
          <>
            {errors.map(e => (
              <Err key={e} message={e} />
            ))}
          </>
        )}
      />
    </div>
  )
}

export default App
