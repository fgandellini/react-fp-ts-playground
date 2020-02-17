import * as IO from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { CRUD, Entity } from './types'
import { sequenceS } from 'fp-ts/lib/Apply'

export const inMemoryStore = <T>() => {
  let sequence: number = 0
  const store: Map<number, Entity<T>> = new Map([])

  // impure functions that deals with the local store

  const inMemItemExists = (id: number): IO.IO<boolean> => IO.of(store.has(id))

  const inMemCreateItem = (item: T): IO.IO<Entity<T>> => {
    sequence = sequence + 1
    const newItem: Entity<T> = { id: sequence, ...item }
    store.set(sequence, newItem)
    return IO.of(newItem)
  }

  const inMemReadItems = (): IO.IO<Array<Entity<T>>> =>
    IO.of(Array.from(store.values()))

  const inMemDeleteItem = (id: number): IO.IO<boolean> =>
    IO.of(store.delete(id))

  const inMemUpdateItem = (item: Entity<T>): IO.IO<Entity<T>> => {
    store.set(item.id, item)
    return IO.of(item)
  }

  const itemNotFoundError = (id: number) => `Item "${id}" does not exist!`

  const crud: CRUD<T> = {
    create: (item: T) => TE.rightIO(inMemCreateItem(item)),

    read: () => TE.rightIO(inMemReadItems()),

    delete: (id: number) =>
      pipe(
        TE.rightIO(inMemDeleteItem(id)),
        TE.chain(done =>
          done // TODO: how to improve this?
            ? TE.right('deleted' as 'deleted')
            : TE.left(itemNotFoundError(id)),
        ),
      ),

    update: (item: Entity<T>) =>
      pipe(
        TE.rightIO(inMemItemExists(item.id)),
        TE.chain(exists =>
          exists // TODO: how to improve this?
            ? TE.rightIO(inMemUpdateItem(item))
            : TE.left(itemNotFoundError(item.id)),
        ),
      ),
  }

  return crud
}
