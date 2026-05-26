import { NavLink } from 'react-router-dom'

const links = [
  { to: '/sessoes',       label: 'Sessões' },
  { to: '/tramitacao',    label: 'Em Tramitação' },
  { to: '/vereadores',    label: 'Vereadores' },
  { to: '/configuracoes', label: 'Configurações' },
]

export function Navbar() {
  return (
    <header className="bg-blue-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg tracking-wide">SDV-PRO</span>
        <nav className="flex gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-white text-blue-900' : 'hover:bg-blue-800'
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