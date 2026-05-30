export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : date.toDate?.() || new Date(date)
  return d.toLocaleDateString('pt-BR')
}

export function formatDateInput(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : date.toDate?.() || new Date(date)
  return d.toISOString().split('T')[0]
}

export function parseDate(dateString) {
  if (!dateString) return new Date()
  const [year, month, day] = dateString.split('-')
  return new Date(year, month - 1, day)
}
