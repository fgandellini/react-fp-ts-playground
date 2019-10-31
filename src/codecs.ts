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

export const UnsignedInteger = Unsigned.pipe(Integer, 'UnsignedInteger')

export const UnsignedIntegerFromString = NonEmptyString.pipe(
  NumberFromString
).pipe(
  UnsignedInteger,
  'UnsignedIntegerFromString'
)

// export enum Unit {
//   Grams = 'grams',
//   Kilograms = 'kilograms',
// }
// export const Unit = t.keyof({
//   [Unit.Grams]: null,
//   [Unit.Kilograms]: null,
// })

export const Unit = t.union([
  t.literal('grams'),
  t.literal('kilograms'),
], 'Unit')

export const Amount = t.type({
  value: Unsigned,
  unit: Unit,
}, 'Amount')

export const Hop = t.type({
  name: t.string,
  amount: Amount,
}, 'Hop')
export const HopsArray = t.array(Hop)

export const Beer = t.type({
  id: UnsignedInteger,
  name: t.string,
  image_url: t.string,
  tagline: t.string,
  // ibu: Unsigned,
  // hops: HopsArray,
}, 'Beer')
export const BeerArray = t.array(Beer)

export const AppConfig = t.type({
  apiRoot: t.string
}, 'AppConfig')
