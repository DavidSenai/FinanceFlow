import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listenExpenses, createExpense, updateExpense, deleteExpense } from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import { TableSkeleton } from '../components/ui/Skeleton'
import { formatCurrency, formatDate, parseDate } from '../utils/formatters'
import { CATEGORIAS, PERIODOS_FILTRO, CORES_CATEGORIAS } from '../utils/constants'
import { filterExpensesByDate, getDateRange } from '../utils/helpers'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

export default function Expenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [periodo, setPeriodo] = useState('mes')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (!user) return
    const unsub = listenExpenses(user.uid, (data) => { setExpenses(data); setLoading(false) })
    return unsub
  }, [user])

  const dateRange = useMemo(() => getDateRange(periodo), [periodo])

  const filtered = useMemo(() => {
    let items = filterExpensesByDate(expenses, dateRange)
    if (search) items = items.filter((e) =>
      e.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      e.categoria?.toLowerCase().includes(search.toLowerCase())
    )
    return items
  }, [expenses, dateRange, search])

  function openCreate() {
    setEditing(null)
    reset({ valor: '', categoria: '', descricao: '', data: new Date().toISOString().split('T')[0] })
    setModalOpen(true)
  }

  function openEdit(e) {
    setEditing(e)
    const d = e.data?.toDate?.() || new Date(e.data)
    reset({ valor: e.valor, categoria: e.categoria, descricao: e.descricao, data: d.toISOString().split('T')[0] })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    try {
      const payload = { ...data, userId: user.uid, valor: Number(data.valor), data: parseDate(data.data) }
      if (editing) {
        await updateExpense(editing.id, payload)
        toast.success('Gasto atualizado!')
      } else {
        await createExpense(payload)
        toast.success('Gasto salvo!')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza?')) return
    try {
      await deleteExpense(id)
      toast.success('Gasto excluído!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-semibold text-light-100">Gastos</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Novo Gasto</Button>
      </div>

      <Card hover={false}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar gastos..."
              className="w-full pl-9 pr-3 py-2 bg-dark-700/30 border border-dark-600 rounded-lg text-sm text-light-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all" />
          </div>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 bg-dark-700/30 border border-dark-600 rounded-lg text-sm text-light-200 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all">
            {PERIODOS_FILTRO.map((p) => (
              <option key={p.value} value={p.value} className="bg-dark-800 text-light-200">{p.label}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card hover={false}>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/30">
                <th className="text-left py-3 px-5 text-xs font-medium text-dark-500 uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-dark-500 uppercase tracking-wider">Categoria</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-dark-500 uppercase tracking-wider">Descrição</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-dark-500 uppercase tracking-wider">Valor</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-dark-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className={`group transition-colors hover:bg-dark-700/10 ${i < filtered.length - 1 ? 'border-b border-dark-700/10' : ''}`}>
                  <td className="py-3 px-5 text-sm text-light-200 tabular-nums">{formatDate(e.data)}</td>
                  <td className="py-3 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-dark-700/30 text-light-200">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: CORES_CATEGORIAS[e.categoria] || '#64748b' }} />
                      {e.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm text-light-100 max-w-[200px] truncate">{e.descricao}</td>
                  <td className="py-3 px-5 text-sm font-medium text-right text-danger tabular-nums">{formatCurrency(Number(e.valor))}</td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded-md hover:bg-dark-700/50 transition-colors">
                        <Edit2 className="w-3.5 h-3.5 text-dark-500" />
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-md hover:bg-dark-700/50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-dark-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-6 h-6 opacity-40" />
                      <p className="text-sm">Nenhum gasto encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Gasto' : 'Novo Gasto'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Valor" type="number" step="0.01" placeholder="0,00"
            {...register('valor', { required: 'Campo obrigatório', min: { value: 0.01, message: 'Valor deve ser positivo' } })}
            error={errors.valor?.message} />
          <Select label="Categoria" options={CATEGORIAS} placeholder="Selecione..."
            {...register('categoria', { required: 'Campo obrigatório' })}
            error={errors.categoria?.message} />
          <Input label="Descrição" placeholder="Descrição do gasto"
            {...register('descricao', { required: 'Campo obrigatório' })}
            error={errors.descricao?.message} />
          <Input label="Data" type="date"
            {...register('data', { required: 'Campo obrigatório' })}
            error={errors.data?.message} />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Atualizar' : 'Salvar Gasto'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
