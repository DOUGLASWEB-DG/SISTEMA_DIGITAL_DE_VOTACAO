import { NavLink } from 'react-router-dom'

const links = [
  { to: '/sessoes',       label: 'Sessões' },
  { to: '/tramitacao',    label: 'Em Tramitação' },
  { to: '/vereadores',    label: 'Vereadores' },
  { to: '/configuracoes', label: 'Configurações' },
]

export function Navbar() {
  return (
    <header className="bg-brazil-blue text-white shadow-lg border-b-2 border-brazil-yellow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg tracking-wide">SISTEMA DE VOTAÇÕES - DGPRO</span>
        <nav className="flex gap-2">
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
        </nav>
      </div>
    </header>
  )
}