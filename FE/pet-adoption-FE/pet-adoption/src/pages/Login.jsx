import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { dashboardPath } from '../utils/format.js'
import { getErrorMessage } from '../api/axiosClient.js'

const field = 'mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login({ email, password })
      navigate(dashboardPath(user.role))
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Welcome back</h1>
      <p className="mt-2 text-muted">Login to manage listings, requests, or your adoption journey.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-card p-6">
        <label className="block text-sm font-medium">
          Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        </label>
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-center text-sm text-muted">
          New here? <Link to="/register" className="font-semibold text-brand">Create an account</Link>
        </p>
        <p className="rounded-2xl bg-sand px-4 py-3 text-xs text-muted">
          Demo: adopter@example.com · owner@example.com · admin@example.com · password Demo@123
        </p>
      </form>
    </div>
  )
}
