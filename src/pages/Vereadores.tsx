import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { useModal } from '../hooks/useModal'
import { Modal } from '../components/ui/Modal'

interface Vereador {
  id: number
  nome: string
  apelido: string
  partido: string
  mesa: string
  responsabilidade_mesa: string
  foto_url: string
  resumo: string
  ativo: number
}

const vazio: Omit<Vereador, 'id'> = {
  nome: '', apelido: '', partido: '', mesa: '',
  responsabilidade_mesa: '', foto_url: '', resumo: '', ativo: 1
}

const MESAS = ['Presidente', 'Vice-Presidente', '1º Secretário', '2º Secretário', '']

export function Vereadores() {
  const [vereadores, setVereadores] = useState<Vereador[]>([])
  const [form, setForm] = useState(vazio)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const modal = useModal<number>()

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get('/vereadores')
      setVereadores(data)
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = () => {
    setForm(vazio)
    setErro('')
    modal.open()
  }

  const abrirEdicao = async (id: number) => {
    try {
      const { data } = await api.get(`/vereadores/${id}`)
      setForm({
        nome: data.nome ?? '',
        apelido: data.apelido ?? '',
        partido: data.partido ?? '',
        mesa: data.mesa ?? '',
        responsabilidade_mesa: data.responsabilidade_mesa ?? '',
        foto_url: data.foto_url ?? '',
        resumo: data.resumo ?? '',
        ativo: data.ativo ?? 1
      })
      setErro('')
      modal.open(id)
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    }
  }

  const salvar = async () => {
    if (!form.nome) return setErro('Nome é obrigatório')
    setLoading(true)
    try {
      if (modal.data) {
        await api.put(`/vereadores/${modal.data}`, form)
      } else {
        await api.post('/vereadores', form)
      }
      await carregar()
      modal.close()
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Vereadores</h1>
        <button
          onClick={abrirNovo}
          className="btn-primary"
        >
          + Novo Vereador
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="table-header">Foto</th>
              <th className="table-header">Nome</th>
              <th className="table-header">Apelido</th>
              <th className="table-header">Partido</th>
              <th className="table-header">Mesa</th>
              <th className="table-header">Resp. Mesa</th>
              <th className="table-header">Resumo</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vereadores.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Nenhum vereador cadastrado.
                </td>
              </tr>
            )}
            {vereadores.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  {v.foto_url ? (
                    <img
                      src={v.foto_url}
                      alt={v.nome}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brazil-blue font-bold text-sm border border-blue-100">
                      {v.nome.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{v.nome}</td>
                <td className="px-4 py-3 text-gray-600">{v.apelido}</td>
                <td className="px-4 py-3">
                  {v.partido && (
                    <span className="px-2 py-1 bg-blue-50 text-brazil-blue rounded text-xs font-semibold">
                      {v.partido}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{v.mesa}</td>
                <td className="px-4 py-3 text-gray-600">{v.responsabilidade_mesa}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{v.resumo}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => abrirEdicao(v.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Editar
                  </button>
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
        title={modal.data ? 'Editar Vereador' : 'Novo Vereador'}
      >
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apelido</label>
            <input
              type="text"
              value={form.apelido}
              onChange={(e) => setForm({ ...form, apelido: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partido</label>
            <input
              type="text"
              value={form.partido}
              onChange={(e) => setForm({ ...form, partido: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesa</label>
            <select
              value={form.mesa}
              onChange={(e) => setForm({ ...form, mesa: e.target.value })}
              className="input-field"
            >
              <option value="">Sem cargo na mesa</option>
              {MESAS.filter(m => m).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsabilidade na Mesa</label>
            <input
              type="text"
              value={form.responsabilidade_mesa}
              onChange={(e) => setForm({ ...form, responsabilidade_mesa: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
  <div className="flex items-center gap-4">
    {form.foto_url ? (
      <img
        src={form.foto_url}
        alt="preview"
        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-brazil-blue font-bold text-lg border-2 border-blue-100">
        {form.nome.charAt(0) || '?'}
      </div>
    )}
    <div className="flex-1">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const fd = new FormData()
          fd.append('foto', file)
          try {
            const { data } = await api.post('/vereadores/upload', fd)
            setForm({ ...form, foto_url: data.url })
          } catch (e: unknown) {
            if (e instanceof Error) setErro(e.message)
          }
        }}
        className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brazil-blue hover:file:bg-blue-100 cursor-pointer"
      />
      <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WEBP — máx. 5MB</p>
    </div>
  </div>
</div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
            <textarea
              value={form.resumo}
              onChange={(e) => setForm({ ...form, resumo: e.target.value })}
              rows={3}
              className="input-field"
            />
          </div>

          {modal.data && (
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={form.ativo === 1}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-brazil-blue focus:ring-brazil-blue border-gray-300 rounded"
              />
              <label htmlFor="ativo" className="text-sm font-medium text-gray-700">Vereador ativo</label>
            </div>
          )}
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