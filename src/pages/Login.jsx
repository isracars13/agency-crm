import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Globe, Loader2, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await signIn(email.trim(), password)
    if (err) setError('אימייל או סיסמה שגויים')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-md mb-3">
            <Globe size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">סוכנות אינטרנט</h1>
          <p className="text-sm text-gray-400 mt-0.5">כניסה למערכת CRM</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="you@example.com"
              dir="ltr"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">סיסמה</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                dir="ltr"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  )
}
