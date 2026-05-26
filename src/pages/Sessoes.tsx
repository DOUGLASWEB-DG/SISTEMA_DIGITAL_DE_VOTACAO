import { useEffect, useState } from 'react'
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
  const modal = useModal()

  const carregar = async () => {
    try {
      const { data } = await api.get(`/sessoes?ano=${ano}`)
      setSessoes(data)
    } catch (e: any) {
      setErro(e.message)
    }
  }

  useEffect(() => { carregar() }, [ano])

  const abrirNovo = () => {
    setForm({ ...vazio, exercicio: ano })
    setErro('')
    modal.open(null)
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
    } catch (e: any) {
      setErro(e.message)
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
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const excluir = async (id: number) => {
    if (!confirm('Excluir esta sessão?')) return
    try {
      await api.delete(`/sessoes/${id}`)
      await carregar()
    } catch (e: any) {
      setErro(e.message)
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
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Nova Sessão
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Nº</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Situação</th>
              <th className="px-4 py-3 text-left">Exercício</th>
              <th className="px-4 py-3 text-left">Ações</th>
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
                    className="text-blue-700 font-semibold hover:underline"
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.situacao === 'ABERTA'    ? 'bg-green-100 text-green-700' :
                    s.situacao === 'ENCERRADA' ? 'bg-gray-100 text-gray-600'  :
                                                 'bg-red-100 text-red-600'
                  }`}>
                    {s.situacao}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{s.exercicio}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => abrirEdicao(s.id)}
                    className="text-blue-600 hover:text-blue-800 mr-3 text-xs"
                  >Editar</button>
                  <button
                    onClick={() => excluir(s.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Situação</label>
            <select
              value={form.situacao}
              onChange={(e) => setForm({ ...form, situacao: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={form.sessao}
              onChange={(e) => setForm({ ...form, sessao: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={modal.close}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={loading}
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}