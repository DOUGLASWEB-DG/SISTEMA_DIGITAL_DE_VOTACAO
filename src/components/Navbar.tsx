import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const links = [
  { to: '/sessoes',       label: 'Sessões' },
  { to: '/tramitacao',    label: 'Em Tramitação' },
  { to: '/vereadores',    label: 'Vereadores' },
  { to: '/configuracoes', label: 'Configurações' },
]

export function Navbar() {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-brazil-blue text-white shadow-lg border-b-2 border-brazil-yellow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-wide">DGPRO</span>
          <span className="text-[10px] uppercase tracking-widest text-blue-200 font-medium">Sistema de Votação Digital</span>
        </div>

        <nav className="flex items-center gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-white text-brazil-blue shadow' : 'hover:bg-blue-800/20 hover:text-brazil-yellow'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          
          <div className="h-6 w-px bg-blue-700/50 mx-2" />

          <div className="flex items-center gap-3 ml-2">
            <div className="flex flex-col items-end mr-1">
              <span className="text-xs font-bold text-white">{usuario?.nome}</span>
              <span className="text-[10px] text-blue-200">{usuario?.cargo}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 text-white rounded-lg transition-colors group"
              title="Sair do Sistema"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:text-red-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}