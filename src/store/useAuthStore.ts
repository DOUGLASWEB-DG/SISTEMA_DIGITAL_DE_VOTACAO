import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Usuario {
  id: number
  nome: string
  email: string
  cargo: string
}

interface AuthState {
  usuario: Usuario | null
  token: string | null
  setAuth: (usuario: Usuario, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      setAuth: (usuario, token) => set({ usuario, token }),
      logout: () => set({ usuario: null, token: null }),
    }),
    {
      name: 'sdvpro-auth',
    }
  )
)
