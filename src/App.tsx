import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Sessoes } from './pages/Sessoes'
import { Tramitacao } from './pages/Tramitacao'
import { Vereadores } from './pages/Vereadores'
import { Configuracoes } from './pages/Configuracoes'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
              <Route path="/" element={<Navigate to="/sessoes" replace />} />
              <Route path="/sessoes"       element={<Sessoes />} />
              <Route path="/tramitacao"    element={<Tramitacao />} />
              <Route path="/vereadores"    element={<Vereadores />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}