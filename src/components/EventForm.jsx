import { useState } from 'react'
import { generateId } from '../utils/helpers'

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

export default function EventForm({ event, clients, initialDate, onSave, onDelete, onCancel }) {
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
        <label className="block text-xs font-semibold text-gray-600 mb-1">כותרת *</label>
        <input name="title" value={form.title} onChange={set} required className={INPUT} placeholder="פגישה עם לקוח" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">תאריך</label>
        <input name="date" type="date" value={form.date} onChange={set} required className={INPUT} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">לקוח (אופציונלי)</label>
        <select name="clientId" value={form.clientId} onChange={set} className={INPUT}>
          <option value="">ללא לקוח</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}{c.businessName ? ` — ${c.businessName}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">תיאור</label>
        <textarea name="description" value={form.description} onChange={set} rows={3}
          className={`${INPUT} resize-none`} placeholder="פרטים נוספים..." />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
          {event ? 'שמור שינויים' : 'הוסף אירוע'}
        </button>
        {event && onDelete && (
          <button type="button" onClick={() => onDelete(event.id)}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm transition-colors">
            מחק
          </button>
        )}
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          ביטול
        </button>
      </div>
    </form>
  )
}
