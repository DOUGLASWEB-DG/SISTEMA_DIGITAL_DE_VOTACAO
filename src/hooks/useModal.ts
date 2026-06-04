import { useState } from 'react'

export function useModal<T = null>() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open  = (payload?: T) => { setData(payload ?? null); setIsOpen(true) }
  const close = () => { setData(null); setIsOpen(false) }

  return { isOpen, data, open, close }
}