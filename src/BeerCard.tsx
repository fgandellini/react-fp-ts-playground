import React from 'react'
import { Beer } from './types'

interface Props {
  beer: Beer
}

export const BeerCard = ({ beer }: Props) => (
  <div className="BeerCard">
    <img className="BeerImage" alt={beer.name} src={beer.image_url}/>
    <div className="BeerName">{beer.name}</div>
  </div>
)
