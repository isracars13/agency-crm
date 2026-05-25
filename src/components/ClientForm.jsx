import { useState } from 'react'
import { NEIGHBORHOODS, STATUSES } from '../utils/constants'
import { generateId } from '../utils/helpers'

const EMPTY = {
  name: '', businessName: '', phone: '', neighborhood: 'מרכז',
  status: 'lead', monthlyPayment: '', startDate: '', notes: '',
}

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

export default function ClientForm({ client, onSave, onCancel }) {
  const [form, setForm] = useState(client ? { ...client } : { ...EMPTY })

  function set(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      id: form.id || generateId(),
      createdAt: form.createdAt || new Date().toISOString(),
      monthlyPayment: Number(form.monthlyPayment) || 0,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">שם *</label>
          <input name="name" value={form.name} onChange={set} required className={INPUT} placeholder="ישראל ישראלי" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">שם העסק</label>
          <input name="businessName" value={form.businessName} onChange={set} className={INPUT} placeholder="חנות פרחים" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">טלפון</label>
          <input name="phone" value={form.phone} onChange={set} className={INPUT} placeholder="050-0000000" dir="ltr" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">שכונה</label>
          <select name="neighborhood" value={form.neighborhood} onChange={set} className={INPUT}>
            {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">סטטוס</label>
          <select name="status" value={form.status} onChange={set} className={INPUT}>
            {Object.entries(STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">תשלום חודשי (₪)</label>
          <input name="monthlyPayment" type="number" min="0" value={form.monthlyPayment} onChange={set}
            className={INPUT} placeholder="1500" dir="ltr" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">תאריך התחלה</label>
        <input name="startDate" type="date" value={form.startDate} onChange={set} className={INPUT} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">הערות</label>
        <textarea name="notes" value={form.notes} onChange={set} rows={3}
          className={`${INPUT} resize-none`} placeholder="הערות נוספות..." />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
          {client ? 'שמור שינויים' : 'הוסף לקוח'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          ביטול
        </button>
      </div>
    </form>
  )
}
