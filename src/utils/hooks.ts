import { useState, useCallback } from 'react'

export const useInputValue = <T>(defaultValue: T) => {
  const [ value, setValue ] = useState(defaultValue)
  const onChange = useCallback(<U extends T>(d: U) => setValue(d), [])
  return {
    value,
    onChange
  }
}
