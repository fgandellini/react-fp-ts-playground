import React, { useEffect, useState } from 'react'
import { fetchBeers } from './api'
import { Beer } from './types'

interface Props {
  className?: string
  renderLoader: () => JSX.Element
  renderBeers: (beers: Beer[]) => JSX.Element
  renderErrors: (errors: string[]) => JSX.Element
}

export const BeerList = ({
  className,
  renderLoader,
  renderBeers,
  renderErrors
}: Props) => {
  const [loading, setLoading] = useState(true)
  const [beers, setBeers] = useState<Array<Beer>>([])
  const [errors, setErrors] = useState<Array<string>>([])

  useEffect(() => {
    const loadBeers = async () => {
      setLoading(true)
      await fetchBeers(setErrors, setBeers)
      setLoading(false)
    }
    loadBeers()
  }, [])

  return (
    <div className={className}>
      {errors && renderErrors(errors)}
      {beers && renderBeers(beers)}
      {loading && renderLoader()}
    </div>
  )
}
