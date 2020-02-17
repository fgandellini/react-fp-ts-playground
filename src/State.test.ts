import * as S from 'fp-ts/lib/State'
import * as O from 'fp-ts/lib/Option'
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply'

interface AppState {
  b: boolean
  n: number
  s: string
}

it('works', () => {
  const appState: AppState = { b: true, n: 4, s: 'test state' }

  const MyState = S.state.of(appState)
  
  S.evalState(MyState)




  

})


const obj = {
  o1: O.some(3),
  o2: O.some('test'),
  p: 'test',
}

const adoOption = sequenceS(O.option)

adoOption(obj)

