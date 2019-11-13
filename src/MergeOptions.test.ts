import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  prop1: string
}
interface B {
  prop2: number
}

type C = A & B

// we need a curried merge function
const merge = (x: A) => (y: B): C => ({ ...x, ...y })

// test data
const someA: O.Option<A> = O.some({ prop1: 'test' })
const someB: O.Option<B> = O.some({ prop2: 1 })
const someC: O.Option<B> = O.some({ prop1: 'test', prop2: 1 })
const none = O.none

it('merge two options (naive)', () => {
  const mergeOptions = (maybeA: O.Option<A>, maybeB: O.Option<B>) =>
    pipe(
      maybeA,
      O.chain(mA => pipe(maybeB, O.map(merge(mA)))),
    )

  expect(mergeOptions(someA, someB)).toEqual(someC)
  expect(mergeOptions(none, someB)).toEqual(none)
  expect(mergeOptions(someA, none)).toEqual(none)
  expect(mergeOptions(none, none)).toEqual(none)
})

it('merge two options', () => {
  const mergeOptions = (maybeA: O.Option<A>, maybeB: O.Option<B>) =>
    pipe(O.some(merge), O.ap(maybeA), O.ap(maybeB))

  expect(mergeOptions(someA, someB)).toEqual(someC)
  expect(mergeOptions(none, someB)).toEqual(none)
  expect(mergeOptions(someA, none)).toEqual(none)
  expect(mergeOptions(none, none)).toEqual(none)
})

it('merge two options (alternative version)', () => {
  const mergeOptions = (maybeA: O.Option<A>, maybeB: O.Option<B>) =>
    pipe(maybeA, O.map(merge), O.ap(maybeB))

  expect(mergeOptions(someA, someB)).toEqual(someC)
  expect(mergeOptions(none, someB)).toEqual(none)
  expect(mergeOptions(someA, none)).toEqual(none)
  expect(mergeOptions(none, none)).toEqual(none)
})
