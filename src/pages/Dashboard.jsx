import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listenExpenses } from '../services/api'
import { CardSkeleton } from '../components/ui/Skeleton'
import Card from '../components/ui/Card'
import { formatCurrency, formatDate } from '../utils/formatters'
import { filterExpensesByDate, getDateRange } from '../utils/helpers'
import { PERIODOS_FILTRO, CORES_CATEGORIAS } from '../utils/constants'
import { TrendingDown, Wallet, PieChart } from 'lucide-react'
import { PieChart as RPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [periodo, setPeriodo] = useState('mes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = listenExpenses(user.uid, (data) => { setExpenses(data); setLoading(false) })
    return unsub
  }, [user])

  const dateRange = useMemo(() => getDateRange(periodo), [periodo])
  const filtered = useMemo(() => filterExpensesByDate(expenses, dateRange), [expenses, dateRange])

  const totalGasto = useMemo(() => filtered.reduce((acc, e) => acc + Number(e.valor), 0), [filtered])
  const qtdGastos = filtered.length

  const topCategoria = useMemo(() => {
    const grupos = {}
    filtered.forEach((e) => { grupos[e.categoria] = (grupos[e.categoria] || 0) + Number(e.valor) })
    let top = '', topValor = 0
    for (const [cat, val] of Object.entries(grupos)) { if (val > topValor) { topValor = val; top = cat } }
    return top || '—'
  }, [filtered])

  const gastosPorCategoria = useMemo(() => {
    const grupos = {}
    filtered.forEach((e) => { grupos[e.categoria] = (grupos[e.categoria] || 0) + Number(e.valor) })
    return Object.entries(grupos).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const recentes = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const da = a.data?.toDate?.() || new Date(a.data)
      const db = b.data?.toDate?.() || new Date(b.data)
      return db - da
    }).slice(0, 5)
  }, [expenses])

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-light-100">Dashboard</h1>
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
          className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-light-200 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all">
          {PERIODOS_FILTRO.map((p) => (
            <option key={p.value} value={p.value} className="bg-dark-800 text-light-200">{p.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-danger/10">
              <TrendingDown className="w-4 h-4 text-danger" />
            </div>
          </div>
          <p className="text-xs font-medium text-dark-500 uppercase tracking-wider">Total Gasto</p>
          <p className="text-2xl font-bold text-light-100 mt-1">{formatCurrency(totalGasto)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-xs font-medium text-dark-500 uppercase tracking-wider">Quantidade</p>
          <p className="text-2xl font-bold text-light-100 mt-1">{qtdGastos}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <PieChart className="w-4 h-4 text-warning" />
            </div>
          </div>
          <p className="text-xs font-medium text-dark-500 uppercase tracking-wider">Principal Categoria</p>
          <p className="text-2xl font-bold text-light-100 mt-1">{topCategoria}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-light-100 mb-4">Gastos por Categoria</h3>
          {gastosPorCategoria.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <RPieChart>
                  <Pie data={gastosPorCategoria} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4} dataKey="value">
                    {gastosPorCategoria.map((entry) => (
                      <Cell key={entry.name} fill={CORES_CATEGORIAS[entry.name] || '#64748b'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: '10px', color: '#FAFAFA', fontSize: '13px' }} />
                </RPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {gastosPorCategoria.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-sm py-1">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CORES_CATEGORIAS[cat.name] || '#64748b' }} />
                    <span className="text-light-200 text-xs truncate">{cat.name}</span>
                    <span className="ml-auto text-light-100 text-xs font-medium tabular-nums">{formatCurrency(cat.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-dark-500">
              <PieChart className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Nenhum gasto no período</p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-light-100 mb-4">Últimos Gastos</h3>
          {recentes.length > 0 ? (
            <div className="space-y-1">
              {recentes.map((e, i) => (
                <div key={e.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${i < recentes.length - 1 ? 'border-b border-dark-700/20' : ''}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CORES_CATEGORIAS[e.categoria] || '#64748b' }} />
                    <div className="min-w-0">
                      <p className="text-sm text-light-100 truncate">{e.descricao}</p>
                      <p className="text-xs text-dark-500">{formatDate(e.data)} · {e.categoria}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-danger shrink-0 ml-3 tabular-nums">{formatCurrency(Number(e.valor))}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-dark-500">
              <Wallet className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Nenhum gasto registrado</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
