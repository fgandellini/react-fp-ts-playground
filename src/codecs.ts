import { chain } from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'
import { fold, none, Option, some } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

export const NonEmptyString = t.refinement(
  t.string,
  s => s !== '',
  'NotEmptyString'
)

const NumberFromString = new t.Type<number, string, string>(
  'NumberFromString',
  t.number.is,
  (s, c) => {
    const n = parseFloat(s)
    return isNaN(n) ? t.failure(s, c) : t.success(n)
  },
  String
)

export const Unsigned = t.refinement(t.number, n => n >= 0, 'Unsigned')

export const Integer = t.refinement(
  t.number,
  n => Number.isInteger(n),
  'Integer'
)

export const UnsignedInteger = Unsigned.pipe(
  Integer,
  'UnsignedInteger'
)

export const UnsignedIntegerFromString = NonEmptyString.pipe(
  NumberFromString
).pipe(
  UnsignedInteger,
  'UnsignedIntegerFromString'
)

const Optional = <C extends t.Mixed>(codec: C) =>
  new t.Type<Option<t.TypeOf<C>>, t.TypeOf<C> | null | undefined, unknown>(
    `Optional(${codec.name})`,
    (u: any): u is Option<t.TypeOf<C>> =>
      u && u._tag && (u._tag === 'Some' || u._tag === 'None'),
    (u, c) => {
      if (u === null || u === undefined) {
        return t.success(none)
      }
      return pipe(
        codec.decode(u),
        chain(d => t.success(some(d)))
      )
    },
    fold(() => null, identity)
  )

// export enum Unit {
//   Grams = 'grams',
//   Kilograms = 'kilograms',
// }
// export const Unit = t.keyof({
//   [Unit.Grams]: null,
//   [Unit.Kilograms]: null,
// })

export const Unit = t.union(
  [t.literal('grams'), t.literal('kilograms')],
  'Unit'
)

export const Amount = t.type(
  {
    value: Unsigned,
    unit: Unit
  },
  'Amount'
)

export const Hop = t.type(
  {
    name: t.string,
    amount: Amount
  },
  'Hop'
)
export const HopsArray = t.array(Hop)

export const Ingredients = t.type(
  {
    hops: Optional(HopsArray)
  },
  'Ingredients'
)

export const Beer = t.type(
  {
    id: UnsignedInteger,
    name: t.string,
    image_url: t.string,
    tagline: t.string,
    ibu: Optional(Unsigned),
    ingredients: Ingredients
  },
  'Beer'
)

export const BeerArray = t.array(Beer)

export const AppConfig = t.type(
  {
    apiRoot: t.string
  },
  'AppConfig'
)
