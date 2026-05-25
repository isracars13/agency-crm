import { useMemo } from 'react'
import { useClients } from '../hooks/useClients'
import { useEvents  } from '../hooks/useEvents'
import StatCard from '../components/StatCard'
import Badge   from '../components/Badge'
import { Users, DollarSign, TrendingUp, Phone, Loader2 } from 'lucide-react'
import { calcTotalEarned, formatCurrency, formatDate } from '../utils/helpers'
import { STATUSES } from '../utils/constants'

export default function Dashboard() {
  const { clients, loading: lc } = useClients()
  const { events,  loading: le } = useEvents()

  const stats = useMemo(() => {
    const active = clients.filter(c => c.status === 'active')
    const leads  = clients.filter(c => c.status === 'lead')
    const mrr    = active.reduce((s, c) => s + Number(c.monthlyPayment || 0), 0)
    return { active: active.length, leads: leads.length, mrr, total: clients.length }
  }, [clients])

  const today          = new Date().toISOString().split('T')[0]
  const upcomingEvents = [...events].filter(e => e.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0, 5)
  const recentClients  = [...clients].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  if (lc || le) return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">דשבורד</h1>
        <p className="text-sm text-gray-400 mt-0.5">סיכום כללי — סוכנות אינטרנט אשדוד</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="לקוחות פעילים" value={stats.active} icon={Users}       color="green"  />
        <StatCard title="MRR"            value={formatCurrency(stats.mrr)} icon={DollarSign} color="blue" subtitle="הכנסה חודשית" />
        <StatCard title="לידים"          value={stats.leads}  icon={TrendingUp}  color="orange" />
        <StatCard title="סה״כ אנשי קשר" value={stats.total}  icon={Phone}       color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">לקוחות אחרונים</h2>
          {recentClients.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">אין לקוחות עדיין</p>
            : (
              <div className="divide-y divide-gray-50">
                {recentClients.map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0 ml-3">
                      <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.businessName || '—'}</p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <Badge status={c.status} />
                      <p className="text-xs text-gray-400 mt-1">{formatCurrency(c.monthlyPayment)}/חודש</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">אירועים קרובים</h2>
          {upcomingEvents.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">אין אירועים קרובים</p>
            : (
              <div className="divide-y divide-gray-50">
                {upcomingEvents.map(ev => {
                  const client = clients.find(c => c.id === ev.clientId)
                  return (
                    <div key={ev.id} className="flex items-center gap-3 py-2.5">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600 leading-none">
                          {new Date(ev.date).getDate()}
                        </span>
                        <span className="text-[9px] text-blue-400 leading-none mt-0.5">
                          {new Date(ev.date).toLocaleDateString('he-IL', { month: 'short' })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{ev.title}</p>
                        <p className="text-xs text-gray-400">{client ? client.name : 'ללא לקוח'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 mb-4">פילוח לפי סטטוס</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(STATUSES).map(([key, cfg]) => {
            const count   = clients.filter(c => c.status === key).length
            const monthly = clients.filter(c => c.status === key).reduce((s,c) => s + Number(c.monthlyPayment||0), 0)
            return (
              <div key={key} className={`${cfg.bg} rounded-xl p-4`}>
                <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                <p className={`text-sm font-medium ${cfg.text} opacity-80`}>{cfg.label}</p>
                {monthly > 0 && <p className={`text-xs ${cfg.text} opacity-60 mt-1`}>{formatCurrency(monthly)}/חודש</p>}
              </div>
            )
          })}
        </div>
      </div>

      {clients.length > 0 && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white">
          <p className="text-blue-100 text-sm font-medium">סה״כ הרוויחת מכל הלקוחות</p>
          <p className="text-3xl font-bold mt-1">
            {formatCurrency(clients.reduce((s, c) => s + calcTotalEarned(c), 0))}
          </p>
          <p className="text-blue-200 text-xs mt-1">מחושב לפי תאריך התחלה × תשלום חודשי</p>
        </div>
      )}
    </div>
  )
}
