import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout       from './components/Layout'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Clients      from './pages/Clients'
import MapPage      from './pages/MapPage'
import CalendarPage from './pages/CalendarPage'
import { Loader2 }  from 'lucide-react'

function Protected({ children }) {
  const { session } = useAuth()
  if (session === undefined) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )
  if (!session) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { session } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={
        <Protected>
          <Layout>
            <Routes>
              <Route path="/"         element={<Dashboard />}    />
              <Route path="/clients"  element={<Clients />}      />
              <Route path="/map"      element={<MapPage />}      />
              <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
          </Layout>
        </Protected>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
