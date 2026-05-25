export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function calcTotalEarned(client) {
  if (!client.startDate || !client.monthlyPayment) return 0
  const start = new Date(client.startDate)
  const now = new Date()
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())
  return Math.max(0, months) * Number(client.monthlyPayment)
}

export function formatCurrency(amount) {
  const n = Number(amount) || 0
  return `₪${n.toLocaleString('he-IL')}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('he-IL')
}
