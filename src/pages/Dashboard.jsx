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
    <div className="flex items-center justify-center h-full text-gray-500">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Дашборд</h1>
        <p className="text-sm text-gray-500 mt-0.5">Общая статистика — Веб Агентство Ашдод</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Активных клиентов" value={stats.active} icon={Users}       color="green"  />
        <StatCard title="MRR"               value={formatCurrency(stats.mrr)} icon={DollarSign} color="blue" subtitle="ежемесячный доход" />
        <StatCard title="Лидов"             value={stats.leads}  icon={TrendingUp}  color="orange" />
        <StatCard title="Всего контактов"   value={stats.total}  icon={Phone}       color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <h2 className="font-semibold text-gray-200 mb-4">Последние клиенты</h2>
          {recentClients.length === 0
            ? <p className="text-gray-600 text-sm text-center py-8">Клиентов пока нет</p>
            : (
              <div className="divide-y divide-gray-700">
                {recentClients.map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-medium text-gray-200 truncate">{c.name}</p>
                      <p className="text-xs text-gray-500 truncate">{c.businessName || '—'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge status={c.status} />
                      <p className="text-xs text-gray-500 mt-1">{formatCurrency(c.monthlyPayment)}/мес</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <h2 className="font-semibold text-gray-200 mb-4">Ближайшие события</h2>
          {upcomingEvents.length === 0
            ? <p className="text-gray-600 text-sm text-center py-8">Событий нет</p>
            : (
              <div className="divide-y divide-gray-700">
                {upcomingEvents.map(ev => {
                  const client = clients.find(c => c.id === ev.clientId)
                  return (
                    <div key={ev.id} className="flex items-center gap-3 py-2.5">
                      <div className="w-10 h-10 bg-blue-900/50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-400 leading-none">
                          {new Date(ev.date).getDate()}
                        </span>
                        <span className="text-[9px] text-blue-600 leading-none mt-0.5">
                          {new Date(ev.date).toLocaleDateString('ru-RU', { month: 'short' })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{ev.title}</p>
                        <p className="text-xs text-gray-500">{client ? client.name : 'Без клиента'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
        <h2 className="font-semibold text-gray-200 mb-4">По статусам</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(STATUSES).map(([key, cfg]) => {
            const count   = clients.filter(c => c.status === key).length
            const monthly = clients.filter(c => c.status === key).reduce((s,c) => s + Number(c.monthlyPayment||0), 0)
            return (
              <div key={key} className={`${cfg.bg} rounded-xl p-4 border border-gray-700`}>
                <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                <p className={`text-sm font-medium ${cfg.text} opacity-80`}>{cfg.label}</p>
                {monthly > 0 && <p className={`text-xs ${cfg.text} opacity-50 mt-1`}>{formatCurrency(monthly)}/мес</p>}
              </div>
            )
          })}
        </div>
      </div>

      {clients.length > 0 && (
        <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl p-5 text-white">
          <p className="text-blue-200 text-sm font-medium">Всего заработано со всех клиентов</p>
          <p className="text-3xl font-bold mt-1">
            {formatCurrency(clients.reduce((s, c) => s + calcTotalEarned(c), 0))}
          </p>
          <p className="text-blue-300 text-xs mt-1">дата начала × ежемесячная оплата</p>
        </div>
      )}
    </div>
  )
}
