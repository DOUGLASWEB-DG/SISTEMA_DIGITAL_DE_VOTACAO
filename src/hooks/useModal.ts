import { useState } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any>(null)

  const open  = (payload?: any) => { setData(payload ?? null); setIsOpen(true) }
  const close = () => { setData(null); setIsOpen(false) }

  return { isOpen, data, open, close }
}