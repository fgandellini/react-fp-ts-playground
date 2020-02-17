import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as t from 'io-ts'
import {
  Amount,
  AppConfig,
  Beer,
  Hop,
  NonEmptyString,
  Unit,
  Unsigned,
  UnsignedInteger,
} from './codecs'

export type Unsigned = t.TypeOf<typeof Unsigned>
export type UnsignedInteger = t.TypeOf<typeof UnsignedInteger>
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>

export type Unit = t.TypeOf<typeof Unit>
export type Amount = t.TypeOf<typeof Amount>
export type Hop = t.TypeOf<typeof Hop>
export type Beer = t.TypeOf<typeof Beer>

export type AppConfig = t.TypeOf<typeof AppConfig>

export type Entity<T> = T & { id: number }
export interface Create<T> {
  create: RTE.ReaderTaskEither<T, string[], Entity<T>>
}
export interface Read<T> {
  read: RTE.ReaderTaskEither<void, string[], Array<Entity<T>>>
}
export interface Update<T> {
  update: RTE.ReaderTaskEither<Entity<T>, string[], Entity<T>>
}
export interface Delete<T> {
  delete: RTE.ReaderTaskEither<number, string[], 'deleted'>
}
export type CRUD<T> = Create<T> & Read<T> & Update<T> & Delete<T>
