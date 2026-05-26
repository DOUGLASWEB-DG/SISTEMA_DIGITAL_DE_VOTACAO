import { useEffect, useState } from 'react'
import api from '../services/api'
import { Modal } from '../components/ui/Modal'
import { useModal } from '../hooks/useModal'

interface Config {
  nome_camara: string
  tempo_pequeno_expediente: string
  tempo_grande_expediente: string
  voto_presidente: string
  fonte_apreciacao: string
}

const vazio: Config = {
  nome_camara: '',
  tempo_pequeno_expediente: '05:00',
  tempo_grande_expediente: '15:00',
  voto_presidente: 'PRESIDENTE VOTA',
  fonte_apreciacao: '16'
}

export function Configuracoes() {
  const [config, setConfig] = useState<Config>(vazio)
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const modal = useModal()

  const carregar = async () => {
    try {
      const { data } = await api.get('/configuracoes')
      setConfig({ ...vazio, ...data })
    } catch (e: any) {
      setErro(e.message)
    }
  }

  useEffect(() => { carregar() }, [])

  const salvar = async () => {
    setLoading(true)
    setSucesso(false)
    setErro('')
    try {
      await api.put('/configuracoes', config)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      id: 'parametros',
      icon: '⚙️',
      label: 'Parâmetros Gerais',
      desc: 'Nome da câmara, tempos de expediente'
    },
    {
      id: 'votacao',
      icon: '🗳️',
      label: 'Votação',
      desc: 'Voto do presidente, tipo de contagem'
    },
    {
      id: 'legislaturas',
      icon: '📋',
      label: 'Legislaturas',
      desc: 'Gerenciar legislaturas e períodos'
    },
    {
      id: 'parlamentares',
      icon: '👥',
      label: 'Parlamentares',
      desc: 'Cadastro de vereadores e mesa'
    },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Configurações</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => modal.open(c.id)}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-3 hover:shadow-md hover:bg-blue-50 transition text-center"
          >
            <span className="text-4xl">{c.icon}</span>
            <span className="font-semibold text-gray-800 text-sm">{c.label}</span>
            <span className="text-xs text-gray-400">{c.desc}</span>
          </button>
        ))}
      </div>

      {/* Modal Parâmetros Gerais */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'parametros'}
        onClose={modal.close}
        title="Parâmetros Gerais"
      >
        {sucesso && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            Configurações salvas com sucesso!
          </div>
        )}
        {erro && modal.data === 'parametros' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Câmara</label>
            <input
              type="text"
              value={config.nome_camara}
              onChange={(e) => setConfig({ ...config, nome_camara: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Pequeno Expediente</label>
            <input
              type="time"
              value={config.tempo_pequeno_expediente}
              onChange={(e) => setConfig({ ...config, tempo_pequeno_expediente: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Grande Expediente</label>
            <input
              type="time"
              value={config.tempo_grande_expediente}
              onChange={(e) => setConfig({ ...config, tempo_grande_expediente: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fonte Apreciação</label>
            <input
              type="number"
              value={config.fonte_apreciacao}
              onChange={(e) => setConfig({ ...config, fonte_apreciacao: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button
            onClick={salvar}
            disabled={loading}
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Gravar'}
          </button>
        </div>
      </Modal>

      {/* Modal Votação */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'votacao'}
        onClose={modal.close}
        title="Configurações de Votação"
      >
        {sucesso && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            Configurações salvas com sucesso!
          </div>
        )}
        {erro && modal.data === 'votacao' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voto do Presidente</label>
            <select
              value={config.voto_presidente}
              onChange={(e) => setConfig({ ...config, voto_presidente: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PRESIDENTE VOTA">Presidente vota</option>
              <option value="PRESIDENTE NAO VOTA">Presidente não vota</option>
              <option value="PRESIDENTE VOTA DESEMPATE">Presidente vota só no desempate</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button
            onClick={salvar}
            disabled={loading}
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Gravar'}
          </button>
        </div>
      </Modal>

      {/* Modal Legislaturas — informativo por ora */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'legislaturas'}
        onClose={modal.close}
        title="Legislaturas"
      >
        <p className="text-sm text-gray-500 mb-4">
          Gerencie as legislaturas e períodos legislativos pelo módulo de Sessões.
          Cada sessão está vinculada a um período legislativo.
        </p>
        <div className="flex justify-end">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
        </div>
      </Modal>

      {/* Modal Parlamentares — redireciona para aba */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'parlamentares'}
        onClose={modal.close}
        title="Parlamentares"
      >
        <p className="text-sm text-gray-500 mb-4">
          O cadastro de vereadores é feito diretamente na aba <strong>Vereadores</strong> no menu superior.
        </p>
        <div className="flex justify-end">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  )
}