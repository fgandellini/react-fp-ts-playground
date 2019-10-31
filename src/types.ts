import * as t from 'io-ts'
import {
  Amount,
  AppConfig,
  Beer,
  Hop,
  NonEmptyString,
  Unit,
  Unsigned,
  UnsignedInteger
} from './codecs'

export type Unsigned = t.TypeOf<typeof Unsigned>
export type UnsignedInteger = t.TypeOf<typeof UnsignedInteger>
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>

export type Unit = t.TypeOf<typeof Unit>
export type Amount = t.TypeOf<typeof Amount>
export type Hop = t.TypeOf<typeof Hop>
export type Beer = t.TypeOf<typeof Beer>

export type AppConfig = t.TypeOf<typeof AppConfig>
