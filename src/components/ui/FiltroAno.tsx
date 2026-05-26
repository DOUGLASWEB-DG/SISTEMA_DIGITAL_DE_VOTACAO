import { useAnoStore } from '../../store/useAnoStore'

export function FiltroAno() {
  const { ano, setAno } = useAnoStore()
  const anos = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)

  return (
    <select
      value={ano}
      onChange={(e) => setAno(Number(e.target.value))}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {anos.map((a) => <option key={a} value={a}>{a}</option>)}
    </select>
  )
}