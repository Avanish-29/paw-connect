import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getErrorMessage } from '../../api/axiosClient.js'

const field = 'mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand'

export default function AdopterProfile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await updateProfile(form)
      setMessage('Profile updated.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Profile</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4 rounded-3xl border border-line bg-card p-6">
        <label className="block text-sm font-medium">
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input disabled value={user?.email || ''} className={`${field} bg-sand`} />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Location
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
        </label>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button type="submit" disabled={loading} className="rounded-full bg-brand px-5 py-2 font-semibold text-white disabled:opacity-60">
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
