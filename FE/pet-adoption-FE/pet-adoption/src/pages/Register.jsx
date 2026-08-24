import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ROLES, dashboardPath, pretty } from '../utils/format.js'
import { getErrorMessage } from '../api/axiosClient.js'

const field = 'mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'ADOPTER',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await register(form)
      navigate(dashboardPath(user.role))
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-4xl">Join PawHome</h1>
      <p className="mt-2 text-muted">Register as an adopter or as an owner / shelter.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-card p-6">
        <label className="block text-sm font-medium">
          Full name
          <input required minLength={2} value={form.name} onChange={(e) => update('name', e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input required minLength={8} type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className={field} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">
            Phone
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={field} />
          </label>
          <label className="text-sm font-medium">
            Location
            <input value={form.location} onChange={(e) => update('location', e.target.value)} className={field} />
          </label>
        </div>
        <label className="block text-sm font-medium">
          I am a
          <select value={form.role} onChange={(e) => update('role', e.target.value)} className={field}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {pretty(role)}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="font-semibold text-brand">Login</Link>
        </p>
      </form>
    </div>
  )
}
