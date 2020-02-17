import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as t from 'io-ts'
import { inMemoryStore } from './in-memory-store'

const codecItem = t.type({
  name: t.string,
  qty: t.number,
})
// type Item = t.TypeOf<typeof codecItem>()

it('works', () => {
  const itemStore = inMemoryStore(codecItem)

  const log = <E, A>(e: E.Either<E, A>) =>
    pipe(e, E.fold(console.error, console.log))

  RTE.run(itemStore.create, { name: 'item 1', qty: 1 }).then(log)
  RTE.run(itemStore.create, { name: 'item 2', qty: 2 }).then(log)
  RTE.run(itemStore.create, { name: 'item 3', qty: 3 }).then(log)
  RTE.run(itemStore.create, { name: 'item 4', qty: 4 }).then(log)

  RTE.run(itemStore.create, { name: 'item', qty: 12 }).then(log)
  RTE.run(itemStore.read, undefined).then(log)
  RTE.run(itemStore.delete, 4).then(log)
  RTE.run(itemStore.read, undefined).then(log)
  RTE.run(itemStore.update, { id: 2, name: 'test', qty: 20 }).then(log)
  RTE.run(itemStore.read, undefined).then(log)
})
