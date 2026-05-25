import { useState } from 'react'
import { generateId } from '../utils/helpers'

const INPUT = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function EventForm({ event, clients, initialDate, onSave, onDelete, onCancel, saving }) {
  const [form, setForm] = useState(event ? { ...event } : {
    title: '', date: initialDate || new Date().toISOString().split('T')[0],
    clientId: '', description: '',
  })

  function set(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, id: form.id || generateId(), createdAt: form.createdAt || new Date().toISOString() })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Название *</label>
        <input name="title" value={form.title} onChange={set} required className={INPUT} placeholder="Встреча с клиентом" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Дата</label>
        <input name="date" type="date" value={form.date} onChange={set} required className={INPUT} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Клиент (необязательно)</label>
        <select name="clientId" value={form.clientId} onChange={set} className={INPUT}>
          <option value="">Без клиента</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}{c.businessName ? ` — ${c.businessName}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Описание</label>
        <textarea name="description" value={form.description} onChange={set} rows={3}
          className={`${INPUT} resize-none`} placeholder="Детали..." />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
          {saving ? 'Сохранение...' : (event ? 'Сохранить' : 'Добавить событие')}
        </button>
        {event && onDelete && (
          <button type="button" onClick={() => onDelete(event.id)}
            className="px-4 py-2 bg-red-900 text-red-300 hover:bg-red-800 border border-red-700 rounded-lg text-sm transition-colors">
            Удалить
          </button>
        )}
        <button type="button" onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors">
          Отмена
        </button>
      </div>
    </form>
  )
}
