import { chain, fold, fromNullable, mapLeft } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import React, { useRef, useState } from 'react'
import { UnsignedIntegerFromString } from './codecs'
import { UnsignedInteger } from './types'

interface Props {
  initialValue: UnsignedInteger
  onChange: (value: UnsignedInteger) => void
  onCommit: (value: UnsignedInteger) => void
  onRevert: (previousValue: UnsignedInteger, revertedValue: string) => void
}

export const UnsignedIntegerInput = ({ initialValue, onChange, onCommit, onRevert }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [lastValidValue, setLastValidValue] = useState(initialValue)
  const [currentInputValue, setCurrentInputValue] = useState(
    initialValue.toString()
  )

  const maybeInput = () =>
    pipe(
      inputRef.current,
      fromNullable('')
    )

  const maybeNumber = (input: HTMLInputElement) =>
    pipe(
      input.value,
      UnsignedIntegerFromString.decode,
      mapLeft(() => input.value)
    )

  const validate = () =>
    pipe(
      maybeInput(),
      chain(maybeNumber)
    )

  const updateInternalState = (value: UnsignedInteger) => {
    setCurrentInputValue(value.toString())
    setLastValidValue(value)
  }

  const handleChange = () =>
    pipe(
      validate(),
      fold(setCurrentInputValue, v => {
        updateInternalState(v)
        onChange(v)
      })
    )

  const revert = (revertedValue: string) => {
    updateInternalState(lastValidValue)
    onRevert(lastValidValue, revertedValue)
  }

  const commit = (value: UnsignedInteger) => {
    updateInternalState(value)
    onCommit(value)
  }

  const handleBlur = () =>
    pipe(
      validate(),
      fold(revert, commit)
    )

  return (
    <input
      ref={inputRef}
      value={currentInputValue}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}
