import { useState, useMemo } from 'react'
import { useClients } from '../hooks/useClients'
import ClientForm from '../components/ClientForm'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { Plus, Search, Phone, MapPin, Trash2, Edit2, TrendingUp, Loader2, Users } from 'lucide-react'
import { calcTotalEarned, formatCurrency, formatDate } from '../utils/helpers'
import { STATUSES } from '../utils/constants'

export default function Clients() {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients()
  const [modal,   setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')

  const filtered = useMemo(() => clients
    .filter(c => {
      const q = search.toLowerCase()
      const matchQ = !q || c.name.toLowerCase().includes(q) || (c.businessName||'').toLowerCase().includes(q)
      return matchQ && (filter === 'all' || c.status === filter)
    })
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  , [clients, search, filter])

  async function save(client) {
    setSaving(true)
    if (editing) await updateClient(client)
    else         await addClient(client)
    setSaving(false)
    close()
  }

  async function del(id) {
    if (window.confirm('Удалить клиента?')) await deleteClient(id)
  }

  function openEdit(c) { setEditing(c); setModal('form') }
  function openAdd()   { setEditing(null); setModal('form') }
  function close()     { setModal(null); setEditing(null) }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )

  return (
    <div className="p-5 md:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Клиенты</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clients.length} контактов всего</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex-shrink-0">
          <Plus size={17} />
          Добавить
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или бизнесу..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['all','Все'], ...Object.entries(STATUSES).map(([k,v])=>[k,v.label])].map(([k,label]) => {
            const active = filter === k
            const cfg    = STATUSES[k]
            return (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? (cfg ? `${cfg.bg} ${cfg.text}` : 'bg-gray-100 text-gray-900')
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0
        ? (
          <div className="text-center py-20 text-gray-600">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">{search || filter !== 'all' ? 'Ничего не найдено' : 'Клиентов пока нет'}</p>
            {!search && filter === 'all' && (
              <button onClick={openAdd} className="mt-3 text-blue-500 text-sm hover:underline">Добавить первого клиента</button>
            )}
          </div>
        )
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(c => (
              <div key={c.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-100 truncate">{c.name}</h3>
                    {c.businessName && <p className="text-sm text-gray-400 truncate">{c.businessName}</p>}
                  </div>
                  <Badge status={c.status} className="flex-shrink-0" />
                </div>

                <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="flex-shrink-0" />
                      <a href={`tel:${c.phone}`} className="hover:text-blue-400 transition-colors">{c.phone}</a>
                    </div>
                  )}
                  {c.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="flex-shrink-0 text-blue-500" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}
                  {!c.address && c.neighborhood && (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="flex-shrink-0" />
                      <span>{c.neighborhood}, Ашдод</span>
                    </div>
                  )}
                  {c.startDate && (
                    <div className="flex items-center gap-2">
                      <TrendingUp size={13} className="flex-shrink-0" />
                      <span>С {formatDate(c.startDate)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">В месяц</p>
                    <p className="font-bold text-gray-200 text-sm">{formatCurrency(c.monthlyPayment)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Всего заработано</p>
                    <p className="font-bold text-green-400 text-sm">{formatCurrency(calcTotalEarned(c))}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)}
                      className="p-2 hover:bg-blue-900/40 rounded-lg text-gray-600 hover:text-blue-400 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => del(c.id)}
                      className="p-2 hover:bg-red-900/40 rounded-lg text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {c.notes && <p className="text-xs text-gray-600 mt-2 truncate" title={c.notes}>{c.notes}</p>}
              </div>
            ))}
          </div>
        )
      }

      <Modal isOpen={modal === 'form'} onClose={close} title={editing ? 'Редактировать клиента' : 'Добавить клиента'}>
        <ClientForm client={editing} onSave={save} onCancel={close} saving={saving} />
      </Modal>
    </div>
  )
}
