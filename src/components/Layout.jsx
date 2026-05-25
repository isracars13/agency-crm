import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Map, Calendar, Globe, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Дашборд'  },
  { to: '/clients',  icon: Users,           label: 'Клиенты'  },
  { to: '/map',      icon: Map,             label: 'Карта'    },
  { to: '/calendar', icon: Calendar,        label: 'Календарь'},
]

export default function Layout({ children }) {
  const { session, signOut } = useAuth()
  const email = session?.user?.email || ''

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 bg-gray-800 border-r border-gray-700 flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-100 text-sm leading-tight">Веб Агентство</p>
              <p className="text-xs text-gray-500">Ашдод</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                }`
              }>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-400">{email[0]?.toUpperCase() || '?'}</span>
            </div>
            <p className="text-xs text-gray-500 truncate flex-1">{email}</p>
          </div>
          <button onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-900/40 hover:text-red-400 transition-colors border border-gray-700">
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gray-800 border-t border-gray-700 flex z-40">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`
            }>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button onClick={signOut}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-gray-500">
          <LogOut size={20} />
          <span>Выйти</span>
        </button>
      </nav>
    </div>
  )
}
