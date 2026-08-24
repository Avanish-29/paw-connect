import { useState } from 'react'
import { getErrorMessage } from '../../api/axiosClient.js'

export default function AdoptionModal({ pet, onClose, onSubmit }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (message.trim().length < 10) {
      setError('Please write at least 10 characters so the shelter understands your intent.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSubmit(message.trim())
    } catch (err) {
      setError(getErrorMessage(err, 'Could not submit this request.'))
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl">
        <h3 className="font-display text-2xl">Apply to adopt {pet?.name}</h3>
        <p className="mt-2 text-sm text-muted">Why would you like to adopt this pet?</p>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-4 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand"
          placeholder="Tell the shelter about your home, experience, and why this pet is a good match."
        />
        {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm text-muted">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
