import { getOrElse, Option } from 'fp-ts/lib/Option'
import React from 'react'

interface Props {
  label: Option<string>
}

const getOrDefault = getOrElse(() => 'default label')

export const Button = ({ label }: Props) => (
  <button>{getOrDefault(label)}</button>
)
