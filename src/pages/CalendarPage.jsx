import { useState, useMemo } from 'react'
import { useClients } from '../hooks/useClients'
import { useEvents  } from '../hooks/useEvents'
import Modal     from '../components/Modal'
import EventForm from '../components/EventForm'
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { MONTHS_RU, DAYS_RU, STATUSES } from '../utils/constants'

const STATUS_BG = {
  lead:        'bg-blue-600',
  negotiation: 'bg-orange-600',
  active:      'bg-green-600',
  cancelled:   'bg-red-600',
}

export default function CalendarPage() {
  const { clients, loading: lc }                                      = useClients()
  const { events, loading: le, addEvent, updateEvent, deleteEvent }   = useEvents()

  const [cursor,  setCursor]  = useState(new Date())
  const [modal,   setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [selDate, setSelDate] = useState(null)
  const [saving,  setSaving]  = useState(false)

  const year  = cursor.getFullYear()
  const month = cursor.getMonth()

  const grid = useMemo(() => {
    const first = new Date(year, month, 1).getDay()
    const days  = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < first; i++) cells.push(null)
    for (let d = 1; d <= days; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [year, month])

  const byDay = useMemo(() => {
    const map = {}
    events.forEach(ev => {
      const d = new Date(ev.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        ;(map[day] = map[day] || []).push(ev)
      }
    })
    return map
  }, [events, year, month])

  const today   = new Date()
  const isToday = d => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const pad2    = n => String(n).padStart(2, '0')
  const dStr    = d => `${year}-${pad2(month + 1)}-${pad2(d)}`

  function openDay(d) { setSelDate(dStr(d)); setEditing(null); setModal('form') }
  function openEv(ev) { setEditing(ev); setSelDate(ev.date); setModal('form') }
  function openNew()  { setEditing(null); setSelDate(today.toISOString().split('T')[0]); setModal('form') }
  function close()    { setModal(null); setEditing(null) }

  async function save(ev) {
    setSaving(true)
    if (editing) await updateEvent(ev)
    else         await addEvent(ev)
    setSaving(false)
    close()
  }

  async function del(id) { await deleteEvent(id); close() }

  if (lc || le) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )

  return (
    <div className="p-5 md:p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Календарь</h1>
          <p className="text-sm text-gray-500 mt-0.5">{events.length} событий всего</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex-shrink-0">
          <Plus size={17} />
          Добавить
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <h2 className="font-bold text-gray-100 text-lg">{MONTHS_RU[month]} {year}</h2>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-700">
          {DAYS_RU.map(d => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-gray-600">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {grid.map((day, i) => {
            const dayEvs = day ? (byDay[day] || []) : []
            return (
              <div key={i}
                onClick={() => day && openDay(day)}
                className={`border-b border-r border-gray-700/50 p-1.5 overflow-hidden ${
                  day ? 'cursor-pointer hover:bg-gray-700/40 transition-colors' : 'bg-gray-900/30'
                }`}
                style={{ minHeight: 64 }}
              >
                {day && (
                  <>
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                      isToday(day) ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'
                    }`}>
                      {day}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvs.slice(0, 3).map(ev => {
                        const cl = clients.find(c => c.id === ev.clientId)
                        const bg = cl ? (STATUS_BG[cl.status] || 'bg-blue-600') : 'bg-blue-600'
                        return (
                          <div key={ev.id}
                            onClick={e => { e.stopPropagation(); openEv(ev) }}
                            className={`${bg} text-white text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity leading-tight`}
                            title={ev.title}>
                            {ev.title}
                          </div>
                        )
                      })}
                      {dayEvs.length > 3 && <p className="text-[10px] text-gray-600 px-1">+{dayEvs.length - 3}</p>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Modal isOpen={modal === 'form'} onClose={close} title={editing ? 'Редактировать событие' : 'Добавить событие'}>
        <EventForm
          event={editing} clients={clients} initialDate={selDate}
          onSave={save} onDelete={del} onCancel={close} saving={saving}
        />
      </Modal>
    </div>
  )
}
