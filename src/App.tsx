import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Sessoes } from './pages/Sessoes'
import { Tramitacao } from './pages/Tramitacao'
import { Vereadores } from './pages/Vereadores'
import { Configuracoes } from './pages/Configuracoes'
import { Login } from './pages/Login'
import { useAuthStore } from './store/useAuthStore'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const token = useAuthStore((state) => state.token)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-soft">
        {token && <Navbar />}
        <main className={token ? "max-w-7xl mx-auto px-4 py-6" : ""}>
          <Routes>
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/sessoes" replace />} />
              
              <Route path="/" element={<PrivateRoute><Navigate to="/sessoes" replace /></PrivateRoute>} />
              <Route path="/sessoes" element={<PrivateRoute><ErrorBoundary nomeDaPagina="Sessões"><Sessoes /></ErrorBoundary></PrivateRoute>} />
              <Route path="/tramitacao" element={<PrivateRoute><ErrorBoundary nomeDaPagina="Tramitação"><Tramitacao /></ErrorBoundary></PrivateRoute>}/>
              <Route path="/vereadores" element={<PrivateRoute><ErrorBoundary nomeDaPagina="Vereadores"><Vereadores /></ErrorBoundary></PrivateRoute>} />
              <Route path="/configuracoes" element={<PrivateRoute><ErrorBoundary nomeDaPagina="Configurações"><Configuracoes /></ErrorBoundary></PrivateRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}