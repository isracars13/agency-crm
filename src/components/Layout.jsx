import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Map, Calendar, Globe, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'דשבורד'   },
  { to: '/clients',  icon: Users,           label: 'לקוחות'   },
  { to: '/map',      icon: Map,             label: 'מפה'       },
  { to: '/calendar', icon: Calendar,        label: 'לוח שנה'  },
]

export default function Layout({ children }) {
  const { session, signOut } = useAuth()
  const email = session?.user?.email || ''

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 bg-white border-l border-gray-100 flex-col flex-shrink-0 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">סוכנות אינטרנט</p>
              <p className="text-xs text-gray-400">אשדוד</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">{email[0]?.toUpperCase() || '?'}</span>
            </div>
            <p className="text-xs text-gray-500 truncate flex-1">{email}</p>
          </div>
          <button onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-100">
            <LogOut size={14} />
            יציאה
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex z-40">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`
            }>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button onClick={signOut}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-gray-400">
          <LogOut size={20} />
          <span>יציאה</span>
        </button>
      </nav>
    </div>
  )
}
