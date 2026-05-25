import { useState } from 'react'
import { NEIGHBORHOODS, STATUSES } from '../utils/constants'

const EMPTY = {
  name: '', businessName: '', phone: '', neighborhood: 'Центр',
  status: 'lead', monthlyPayment: '', startDate: '', notes: '', address: '',
}

const INPUT = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function ClientForm({ client, onSave, onCancel, saving }) {
  const [form, setForm] = useState(client ? { ...client } : { ...EMPTY })

  function set(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({ ...form, monthlyPayment: Number(form.monthlyPayment) || 0 })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Имя *</label>
          <input name="name" value={form.name} onChange={set} required className={INPUT} placeholder="Иван Иванов" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Название бизнеса</label>
          <input name="businessName" value={form.businessName} onChange={set} className={INPUT} placeholder="ООО Ромашка" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Телефон</label>
          <input name="phone" value={form.phone} onChange={set} className={INPUT} placeholder="050-0000000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Район</label>
          <select name="neighborhood" value={form.neighborhood} onChange={set} className={INPUT}>
            {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Адрес</label>
        <input name="address" value={form.address} onChange={set} className={INPUT}
          placeholder="ул. Герцля 5, Ашдод" />
        <p className="text-xs text-gray-600 mt-1">Адрес будет отображён на карте</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Статус</label>
          <select name="status" value={form.status} onChange={set} className={INPUT}>
            {Object.entries(STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Оплата в месяц (₪)</label>
          <input name="monthlyPayment" type="number" min="0" value={form.monthlyPayment} onChange={set}
            className={INPUT} placeholder="1500" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Дата начала</label>
        <input name="startDate" type="date" value={form.startDate} onChange={set} className={INPUT} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Заметки</label>
        <textarea name="notes" value={form.notes} onChange={set} rows={3}
          className={`${INPUT} resize-none`} placeholder="Дополнительная информация..." />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
          {saving ? 'Сохранение...' : (client ? 'Сохранить' : 'Добавить клиента')}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors">
          Отмена
        </button>
      </div>
    </form>
  )
}
