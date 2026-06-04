import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAnoStore } from '../store/useAnoStore'
import { useModal } from '../hooks/useModal'
import { Modal } from '../components/ui/Modal'
import { FiltroAno } from '../components/ui/FiltroAno'

interface Protocolo {
  id: number
  numero: number
  tipo: string
  data: string
  proponente: string
  ementa: string
  status: string
  exercicio: number
  votacao: string
}

const TIPOS = [
  'REQUERIMENTO', 'PROJETO DE LEI', 'MOÇÃO', 'INDICAÇÃO',
  'VOTAÇÃO CA ATA', 'OFÍCIO', 'RESOLUÇÃO', 'DECRETO LEGISLATIVO'
]

const VOTACOES = ['MAIORIA SIMPLES', 'MAIORIA ABSOLUTA', 'DOIS TERÇOS']

const vazio: Omit<Protocolo, 'id'> = {
  numero: 0, tipo: '', data: '', proponente: '',
  ementa: '', status: 'ABERTO',
  exercicio: new Date().getFullYear(), votacao: ''
}

export function Tramitacao() {
  const { ano } = useAnoStore()
  const [protocolos, setProtocolos] = useState<Protocolo[]>([])
  const [busca, setBusca] = useState('')
  const [form, setForm] = useState(vazio)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const modal = useModal<number>()

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get(`/protocolos?ano=${ano}&busca=${busca}`)
      setProtocolos(data)
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }, [ano, busca])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = () => {
    setForm({ ...vazio, exercicio: ano })
    setErro('')
    modal.open()
  }

  const abrirEdicao = async (id: number) => {
    try {
      const { data } = await api.get(`/protocolos/${id}`)
      setForm({
        numero: data.numero,
        tipo: data.tipo,
        data: data.data?.slice(0, 10),
        proponente: data.proponente,
        ementa: data.ementa ?? '',
        status: data.status,
        exercicio: data.exercicio,
        votacao: data.votacao ?? ''
      })
      setErro('')
      modal.open(id)
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }

  const salvar = async () => {
    if (!form.data)       return setErro('Data é obrigatória')
    if (!form.proponente) return setErro('Proponente é obrigatório')
    if (!form.tipo)       return setErro('Tipo é obrigatório')
    setLoading(true)
    try {
      if (modal.data) {
        await api.put(`/protocolos/${modal.data}`, form)
      } else {
        await api.post('/protocolos', form)
      }
      await carregar()
      modal.close()
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const excluir = async (id: number) => {
    if (!confirm('Excluir este protocolo?')) return
    try {
      await api.delete(`/protocolos/${id}`)
      await carregar()
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }

  const somenteLeitura = (id: number) => {
    const p = protocolos.find(p => p.id === id)
    return p?.status === 'ENCERRADO'
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Em Tramitação</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field max-w-[200px]"
          />
          <FiltroAno />
          <button
            onClick={abrirNovo}
            className="btn-primary"
          >
            + Novo Protocolo
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="table-header">Nº</th>
              <th className="table-header">Tipo</th>
              <th className="table-header">Data</th>
              <th className="table-header">Proponente</th>
              <th className="table-header">Ementa</th>
              <th className="table-header">Status</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {protocolos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum registro encontrado para este exercício.
                </td>
              </tr>
            )}
            {protocolos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <button
                    onClick={() => abrirEdicao(p.id)}
                    className="text-brazil-blue font-semibold hover:underline"
                  >
                    {p.numero}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-700">{p.tipo}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(p.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-gray-700">{p.proponente}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{p.ementa}</td>
                <td className="px-4 py-3">
                  <span className={
                    p.status === 'ABERTO'
                      ? 'badge-success'
                      : 'badge-neutral'
                  }>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => abrirEdicao(p.id)}
                    className="text-blue-600 hover:text-blue-800 mr-3 text-xs font-medium"
                  >
                    {p.status === 'ENCERRADO' ? 'Visualizar' : 'Editar'}
                  </button>
                  {p.status !== 'ENCERRADO' && (
                    <button
                      onClick={() => excluir(p.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={
          somenteLeitura(modal.data)
            ? 'Visualizar Protocolo'
            : modal.data ? 'Editar Protocolo' : 'Novo Protocolo'
        }
      >
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}

        {somenteLeitura(modal.data) && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm">
            Este protocolo está encerrado — somente visualização.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select
              value={form.tipo}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="input-field disabled:bg-gray-100"
            >
              <option value="">Selecione...</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input
              type="number"
              value={form.numero}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, numero: Number(e.target.value) })}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              value={form.data}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Votação</label>
            <select
              value={form.votacao}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, votacao: e.target.value })}
              className="input-field disabled:bg-gray-100"
            >
              <option value="">Selecione...</option>
              {VOTACOES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Proponente *</label>
            <input
              type="text"
              value={form.proponente}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, proponente: e.target.value })}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ementa</label>
            <textarea
              value={form.ementa}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, ementa: e.target.value })}
              rows={3}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input-field disabled:bg-gray-100"
            >
              <option value="ABERTO">ABERTO</option>
              <option value="ENCERRADO">ENCERRADO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercício</label>
            <input
              type="number"
              value={form.exercicio}
              disabled={somenteLeitura(modal.data)}
              onChange={(e) => setForm({ ...form, exercicio: Number(e.target.value) })}
              className="input-field disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={modal.close}
            className="btn-secondary"
          >
            {somenteLeitura(modal.data) ? 'Fechar' : 'Cancelar'}
          </button>
          {!somenteLeitura(modal.data) && (
            <button
              onClick={salvar}
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </Modal>
    </div>
  )
}