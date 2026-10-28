export function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export function formatDateTime(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
