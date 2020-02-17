import { sequenceS } from 'fp-ts/lib/Apply'
import * as O from 'fp-ts/lib/Option'

it('creates an object out of a set of optional values', () => {
  const adoOption = sequenceS(O.option)

  const getPropN = (): O.Option<number> => O.some(3)
  const getPropS = (): O.Option<string> => O.some('test')
  const getPropB = (): O.Option<boolean> => O.some(true)

  const obj = {
    n: getPropN(),
    s: getPropS(),
    b: getPropB(),
  }

  expect(adoOption(obj)).toEqual(O.some({ n: 3, s: 'test', b: true }))
  expect(adoOption({ a: O.some('a'), b: O.none })).toEqual(O.none)
})
