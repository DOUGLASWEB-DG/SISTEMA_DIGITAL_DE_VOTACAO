import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, senha })
      setAuth(data.usuario, data.token)
      navigate('/sessoes')
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brazil-blue p-8 text-center border-b-4 border-brazil-yellow">
          <h1 className="text-white text-2xl font-bold tracking-tight">SISTEMA DE VOTAÇÕES - DGPRO</h1>
          <p className="text-blue-100 text-sm mt-1 uppercase font-medium tracking-widest">Acesso Restrito</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium animate-shake">
              {erro}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input-field"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-base"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
          
          <div className="text-center">
             <button type="button" className="text-sm text-gray-400 hover:text-brazil-blue transition-colors">
               Esqueceu sua senha?
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
