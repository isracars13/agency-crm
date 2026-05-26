import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Globe, Loader2, Eye, EyeOff } from 'lucide-react'

const MAX_ATTEMPTS = 3
const LOCKOUT_MS   = 15 * 60 * 1000

export default function Login() {
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)

  function validate() {
    if (!email.trim()) return 'Введите email'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Неверный формат email'
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов'
    return null
  }

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (lockedUntil && Date.now() < lockedUntil) {
      const mins = Math.ceil((lockedUntil - Date.now()) / 60000)
      setError(`Слишком много попыток. Подождите ${mins} мин.`)
      return
    }

    const validErr = validate()
    if (validErr) { setError(validErr); return }

    setLoading(true)
    const err = await signIn(email.trim(), password)
    setLoading(false)

    if (err) {
      const next = attempts + 1
      setAttempts(next)
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS)
        setError('Аккаунт заблокирован на 15 минут из-за множества неудачных попыток')
      } else {
        setError(`Неверный email или пароль (попытка ${next} из ${MAX_ATTEMPTS})`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Globe size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-100">Веб Агентство</h1>
          <p className="text-sm text-gray-500 mt-0.5">CRM система</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus placeholder="you@example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Пароль</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/30 border border-red-800 rounded-lg py-2 px-3">{error}</p>
          )}

          <button type="submit" disabled={loading || (lockedUntil && Date.now() < lockedUntil)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
