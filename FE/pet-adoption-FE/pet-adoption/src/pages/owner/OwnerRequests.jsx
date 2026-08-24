import { useEffect, useState } from 'react'
import { adoptionApi } from '../../api/adoptionApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatDate } from '../../utils/format.js'

export default function OwnerRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [action, setAction] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    setLoading(true)
    adoptionApi
      .owner()
      .then(setRequests)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function confirm() {
    setWorking(true)
    try {
      if (action.type === 'approve') await adoptionApi.approve(action.id)
      else await adoptionApi.reject(action.id, 'Not a match at this time')
      setAction(null)
      load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setWorking(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h1 className="font-display text-4xl">Adoption requests</h1>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      {!requests.length ? (
        <div className="mt-6">
          <EmptyState title="No requests yet" message="When adopters apply for your pets, they will appear here." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-sand/70 text-muted">
              <tr>
                <th className="px-5 py-3">Pet</th>
                <th className="px-5 py-3">Adopter</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t border-line align-top">
                  <td className="px-5 py-3 font-medium">{request.pet?.name}</td>
                  <td className="px-5 py-3">{request.adopter?.name}</td>
                  <td className="max-w-xs px-5 py-3 text-muted">{request.message}</td>
                  <td className="px-5 py-3 text-muted">{formatDate(request.createdAt)}</td>
                  <td className="px-5 py-3"><StatusBadge value={request.status} /></td>
                  <td className="px-5 py-3 space-x-3">
                    {request.status === 'PENDING' ? (
                      <>
                        <button type="button" className="text-emerald-700" onClick={() => setAction({ type: 'approve', id: request.id })}>
                          Approve
                        </button>
                        <button type="button" className="text-rose-700" onClick={() => setAction({ type: 'reject', id: request.id })}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(action)}
        title={action?.type === 'approve' ? 'Approve this request?' : 'Reject this request?'}
        message={
          action?.type === 'approve'
            ? 'The pet will be marked as adopted and other pending requests for the same pet will be rejected.'
            : 'The adopter will see this request as rejected.'
        }
        confirmLabel={action?.type === 'approve' ? 'Approve' : 'Reject'}
        tone={action?.type === 'approve' ? 'brand' : 'danger'}
        loading={working}
        onClose={() => setAction(null)}
        onConfirm={confirm}
      />
    </div>
  )
}
