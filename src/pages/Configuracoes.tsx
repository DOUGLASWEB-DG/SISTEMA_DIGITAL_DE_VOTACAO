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
      label: 'Votação Nominal',
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
    {
      id: 'anexos',
      icon: '📎',
      label: 'Anexos',
      desc: 'Gerenciar documentos e anexos'
    },
    {
      id: 'logomarca',
      icon: '🖼️',
      label: 'Logomarca',
      desc: 'Configurar brasão e logos'
    },
    {
      id: 'agenda',
      icon: '📅',
      label: 'Agenda',
      desc: 'Calendário de atividades'
    },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Configurações</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => modal.open(c.id)}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-3 hover:shadow-md hover:bg-blue-50 transition text-center h-full"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Câmara *</label>
            <input
              type="text"
              value={config.nome_camara}
              onChange={(e) => setConfig({ ...config, nome_camara: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Pequeno Expediente *</label>
            <input
              type="time"
              value={config.tempo_pequeno_expediente}
              onChange={(e) => setConfig({ ...config, tempo_pequeno_expediente: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Grande Expediente *</label>
            <input
              type="time"
              value={config.tempo_grande_expediente}
              onChange={(e) => setConfig({ ...config, tempo_grande_expediente: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button
            onClick={() => {
              if(!config.nome_camara) return setErro('Nome da Câmara é obrigatório')
              salvar()
            }}
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
        title="Configurações de Votação Nominal"
      >
        <div className="grid grid-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voto do Presidente *</label>
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
            Gravar
          </button>
        </div>
      </Modal>

      {/* Modal Legislaturas */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'legislaturas'}
        onClose={modal.close}
        title="Legislaturas"
      >
        {erro && modal.data === 'legislaturas' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número da Legislatura *</label>
            <input type="number" id="leg-num" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano Início *</label>
            <input type="number" id="leg-inicio" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button 
            onClick={() => {
              const num = (document.getElementById('leg-num') as HTMLInputElement)?.value
              const ini = (document.getElementById('leg-inicio') as HTMLInputElement)?.value
              if(!num || !ini) return setErro('Número e Ano Início são obrigatórios')
              salvar()
            }} 
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Gravar
          </button>
        </div>
      </Modal>

      {/* Modal Parlamentares */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'parlamentares'}
        onClose={modal.close}
        title="Gestão de Parlamentares"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">O cadastro detalhado de parlamentares deve ser realizado na aba principal <strong>Vereadores</strong>.</p>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 font-medium">Dica:</p>
            <p className="text-xs text-blue-600">Lá você poderá subir fotos, definir cargos na mesa e partidos.</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={modal.close} className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800">
            Entendido
          </button>
        </div>
      </Modal>

      {/* Modal Logomarca */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'logomarca'}
        onClose={modal.close}
        title="Configuração de Logomarca"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Sem Logo
          </div>
          <input type="file" className="text-sm" />
          <p className="text-xs text-gray-400">Dimensões sugeridas: 200x200px</p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button onClick={salvar} className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800">
            Gravar
          </button>
        </div>
      </Modal>

      {/* Modal Agenda */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'agenda'}
        onClose={modal.close}
        title="Agenda Legislativa"
      >
        {erro && modal.data === 'agenda' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}
        <div className="space-y-4">
          <p className="text-sm text-gray-600 italic">Configure as datas das próximas sessões e eventos.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do Evento *</label>
            <input type="date" id="agenda-data" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea id="agenda-desc" placeholder="Descrição do evento" className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button 
            onClick={() => {
              const d = (document.getElementById('agenda-data') as HTMLInputElement)?.value
              const desc = (document.getElementById('agenda-desc') as HTMLTextAreaElement)?.value
              if(!d || !desc) return setErro('Data e descrição são obrigatórios')
              salvar()
            }} 
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Gravar
          </button>
        </div>
      </Modal>

      {/* Modal Anexos */}
      <Modal
        isOpen={modal.isOpen && modal.data === 'anexos'}
        onClose={modal.close}
        title="Documentos e Anexos"
      >
        {erro && modal.data === 'anexos' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
             <p className="text-sm font-medium text-gray-700">Adicionar Novo Modelo *</p>
             <input type="file" id="anexo-file" className="mt-2 text-xs" />
          </div>
          <p className="text-xs text-gray-400 italic">Formatos permitidos: PDF, DOCX, XLSX.</p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={modal.close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
          <button 
            onClick={() => {
              const f = (document.getElementById('anexo-file') as HTMLInputElement)?.files?.length
              if(!f) return setErro('Selecione um arquivo para o anexo')
              salvar()
            }} 
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Gravar
          </button>
        </div>
      </Modal>
    </div>
  )
}