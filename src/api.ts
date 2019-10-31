import { chain, fold, mapLeft } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { ReaderTaskEither, run } from 'fp-ts/lib/ReaderTaskEither'
import { tryCatch } from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'
import { BeerArray } from './codecs'
import { AppConfig, Beer } from './types'

const APP_CONFIG: AppConfig = {
  apiRoot: 'https://api.punkapi.com/v2'
}

const fetchData: ReaderTaskEither<AppConfig, string[], unknown> = (
  config: AppConfig
) =>
  tryCatch<string[], unknown>(
    () => fetch(`${config.apiRoot}/beers`).then(res => res.json()),
    _reason => ['API Error']
  )

export const fetchBeers = (
  onError: (errors: string[]) => void,
  onSuccess: (beers: Beer[]) => void
) =>
  run(fetchData, APP_CONFIG).then(maybeRes =>
    pipe(
      maybeRes,
      chain(res =>
        pipe(
          res,
          BeerArray.decode,
          mapLeft(failure)
        )
      ),
      fold(onError, onSuccess)
    )
  )
