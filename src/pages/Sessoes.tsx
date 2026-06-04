import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { useAnoStore } from '../store/useAnoStore'
import { useModal } from '../hooks/useModal'
import { Modal } from '../components/ui/Modal'
import { FiltroAno } from '../components/ui/FiltroAno'

interface Sessao {
  id: number
  numero: number
  tipo: string
  data: string
  hora: string
  situacao: string
  exercicio: number
  periodo_legislativo_id: number | null
  sessao: string
}

const TIPOS = ['ORDINÁRIA', 'EXTRAORDINÁRIA', 'SOLENE', 'ESPECIAL']
const SITUACOES = ['ABERTA', 'ENCERRADA', 'CANCELADA']

const vazio: Omit<Sessao, 'id'> = {
  numero: 0, tipo: '', data: '', hora: '09:00',
  situacao: 'ABERTA', exercicio: new Date().getFullYear(),
  periodo_legislativo_id: null, sessao: ''
}

export function Sessoes() {
  const { ano } = useAnoStore()
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [form, setForm] = useState(vazio)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const modal = useModal<number>()

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get(`/sessoes?ano=${ano}`)
      setSessoes(data)
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }, [ano])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = () => {
    setForm({ ...vazio, exercicio: ano })
    setErro('')
    modal.open()
  }

  const abrirEdicao = async (id: number) => {
    try {
      const { data } = await api.get(`/sessoes/${id}`)
      setForm({
        numero: data.numero,
        tipo: data.tipo,
        data: data.data?.slice(0, 10),
        hora: data.hora,
        situacao: data.situacao,
        exercicio: data.exercicio,
        periodo_legislativo_id: data.periodo_legislativo_id,
        sessao: data.sessao ?? ''
      })
      setErro('')
      modal.open(id)
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }

  const salvar = async () => {
    if (!form.data) return setErro('Data é obrigatória')
    if (!form.tipo) return setErro('Tipo é obrigatório')
    setLoading(true)
    try {
      if (modal.data) {
        await api.put(`/sessoes/${modal.data}`, form)
      } else {
        await api.post('/sessoes', form)
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
    if (!confirm('Excluir esta sessão?')) return
    try {
      await api.delete(`/sessoes/${id}`)
      await carregar()
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Sessões</h1>
        <div className="flex items-center gap-3">
          <FiltroAno />
          <button
            onClick={abrirNovo}
            className="btn-primary"
          >
            + Nova Sessão
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
              <th className="table-header">Hora</th>
              <th className="table-header">Situação</th>
              <th className="table-header">Exercício</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sessoes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum registro encontrado para este exercício.
                </td>
              </tr>
            )}
            {sessoes.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <button
                    onClick={() => abrirEdicao(s.id)}
                    className="text-brazil-blue font-semibold hover:underline"
                  >
                    {String(s.numero).padStart(2, '0')}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-700">{s.tipo}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(s.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-gray-700">{s.hora}</td>
                <td className="px-4 py-3">
                  <span className={
                    s.situacao === 'ABERTA'    ? 'badge-success' :
                    s.situacao === 'ENCERRADA' ? 'badge-neutral' :
                                                 'badge-danger'
                  }>
                    {s.situacao}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{s.exercicio}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => abrirEdicao(s.id)}
                    className="text-blue-600 hover:text-blue-800 mr-3 text-xs font-medium"
                  >Editar</button>
                  <button
                    onClick={() => excluir(s.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >Excluir</button>
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
        title={modal.data ? 'Editar Sessão' : 'Nova Sessão'}
      >
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sessão *</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="input-field"
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
              onChange={(e) => setForm({ ...form, numero: Number(e.target.value) })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Situação</label>
            <select
              value={form.situacao}
              onChange={(e) => setForm({ ...form, situacao: e.target.value })}
              className="input-field"
            >
              {SITUACOES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercício</label>
            <input
              type="number"
              value={form.exercicio}
              onChange={(e) => setForm({ ...form, exercicio: Number(e.target.value) })}
              className="input-field"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={form.sessao}
              onChange={(e) => setForm({ ...form, sessao: e.target.value })}
              rows={3}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={modal.close}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={loading}
            className="btn-primary px-8"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}