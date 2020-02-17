import * as E from 'fp-ts/lib/Either'
import * as IO from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import * as t from 'io-ts'
import { failure } from 'io-ts/lib/PathReporter'
import { CRUD, Entity } from './types'

const codecId = t.type({ id: t.number })

export const inMemoryStore = <C extends t.Mixed>(codec: C) => {
  type T = t.TypeOf<C>
  type E = Entity<T>
  const codecE = t.intersection([codecId, codec])
  let sequence: number = 0
  const store: Map<number, E> = new Map([])

  // impure functions that deals with the local store

  const inMemItemExists = (id: number): IO.IO<boolean> => IO.of(store.has(id))

  const inMemCreateItem = (item: T): IO.IO<E> => {
    sequence = sequence + 1
    const newItem: E = { id: sequence, ...item }
    store.set(sequence, newItem)
    return IO.of(newItem)
  }

  const inMemReadItems = (): IO.IO<Array<E>> =>
    IO.of(Array.from(store.values()))

  const inMemDeleteItem = (id: number): IO.IO<boolean> =>
    IO.of(store.delete(id))

  const inMemUpdateItem = (item: E): IO.IO<E> => {
    store.set(item.id, item)
    return IO.of(item)
  }

  const itemNotFoundError = (id: number) => [`Item "${id}" does not exist!`]

  // decoders

  const decodeId = (x: unknown) => pipe(t.number.decode(x), E.mapLeft(failure))
  const decodeOneC = (x: unknown) => pipe(codec.decode(x), E.mapLeft(failure))
  const decodeOneE = (x: unknown) => pipe(codecE.decode(x), E.mapLeft(failure))
  const decodeManyE = (xs: unknown) =>
    pipe(t.array(codecE).decode(xs), E.mapLeft(failure))

  const crud: CRUD<T> = {
    create: (item: C) =>
      pipe(
        TE.fromEither(decodeOneC(item)),
        TE.chain(i => TE.rightIO(inMemCreateItem(i))),
      ),

    read: () =>
      pipe(
        TE.rightIO(inMemReadItems()),
        TE.chain(xs => TE.fromEither(decodeManyE(xs))),
      ),

    delete: (id: number) =>
      pipe(
        TE.fromEither(decodeId(id)),
        TE.chain(id => TE.rightIO(inMemDeleteItem(id))),
        TE.chain(done =>
          done // TODO: how to improve this?
            ? TE.right('deleted' as 'deleted')
            : TE.left(itemNotFoundError(id)),
        ),
      ),

    update: (item: E) =>
      pipe(
        TE.fromEither(decodeOneE(item)),
        TE.chain(i => TE.rightIO(inMemItemExists(i.id))),
        TE.chain(exists =>
          exists // TODO: how to improve this?
            ? TE.rightIO(inMemUpdateItem(item))
            : TE.left(itemNotFoundError(item.id)),
        ),
      ),
  }

  return crud
}
