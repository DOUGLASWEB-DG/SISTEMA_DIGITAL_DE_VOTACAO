import { create } from 'zustand'

interface AnoStore {
    ano: number
    setAno: (ano: number) => void
}

export const useAnoStore = create<AnoStore>((set) => ({
    ano: new Date().getFullYear(),
    setAno: (ano) => set({ ano })
}))