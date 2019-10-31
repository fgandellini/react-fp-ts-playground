import React from 'react'

interface Props {
  message: string
}

export const Err = ({ message }: Props) => (
  <div className="Err">{message}</div>
)
