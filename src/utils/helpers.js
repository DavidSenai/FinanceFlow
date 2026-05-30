import { startOfDay, endOfDay, subDays, startOfMonth, startOfYear, parseISO } from 'date-fns'

export function getDateRange(periodo, dataInicio, dataFim) {
  const hoje = new Date()
  const hojeFim = endOfDay(hoje)
  let inicio, fim

  switch (periodo) {
    case '30d':
      inicio = startOfDay(subDays(hoje, 30))
      fim = hojeFim
      break
    case 'mes':
      inicio = startOfMonth(hoje)
      fim = hojeFim
      break
    case 'ano':
      inicio = startOfYear(hoje)
      fim = hojeFim
      break
    case 'personalizado':
      inicio = dataInicio ? startOfDay(parseISO(dataInicio)) : startOfDay(subDays(hoje, 30))
      fim = dataFim ? endOfDay(parseISO(dataFim)) : hojeFim
      break
    default:
      inicio = startOfDay(subDays(hoje, 30))
      fim = hojeFim
  }

  return { inicio, fim }
}

export function filterExpensesByDate(expenses, { inicio, fim }) {
  return expenses.filter((e) => {
    const data = e.data?.toDate?.() || new Date(e.data)
    return data >= inicio && data <= fim
  })
}
