import { useState } from 'react'

const useInputState = () => {
  const [value, setVal] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value)
  }

  const onReset = () => setVal('')

  return {
    value,
    onChange,
    onReset,
  }
}

export default useInputState
