import { getOrElse, map } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import React from 'react'
import { Beer, Hop } from './types'

interface Props {
  beer: Beer
}

const HopName = ({ hopName }: { hopName: string }) => (
  <div className="BeerHopName">{hopName}</div>
)

const HopList = ({ hops }: { hops: Hop[] }) => (
  <div className="BeerHops">
    {hops.map(hop => (
      <HopName hopName={hop.name} />
    ))}
  </div>
)

export const BeerCard = ({ beer }: Props) => (
  <div className="BeerCard">
    <img className="BeerImage" alt={beer.name} src={beer.image_url} />
    <div className="BeerName">{beer.name}</div>
    <div>
      {pipe(
        beer.ibu,
        map(ibu => <div className="BeerIbu">IBU: {ibu}</div>),
        getOrElse(() => <div className="MissingData">Missing IBU</div>)
      )}
    </div>
    <div className="BeerHops">
      {pipe(
        beer.ingredients.hops,
        map(hops => <HopList hops={hops} />),
        getOrElse(() => <div className="MissingData">Missing Hops</div>)
      )}
    </div>
  </div>
)
