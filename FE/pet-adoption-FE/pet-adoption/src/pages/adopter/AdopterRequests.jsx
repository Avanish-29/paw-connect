import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adoptionApi } from '../../api/adoptionApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatDate } from '../../utils/format.js'

export default function AdopterRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelId, setCancelId] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    setLoading(true)
    adoptionApi
      .mine()
      .then(setRequests)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function confirmCancel() {
    setWorking(true)
    try {
      await adoptionApi.cancel(cancelId)
      setCancelId(null)
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
      <h1 className="font-display text-4xl">My requests</h1>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      {!requests.length ? (
        <div className="mt-6">
          <EmptyState
            title="No requests yet"
            message="Browse available pets and send your first adoption request."
            action={<Link to="/pets" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Find a Pet</Link>}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand/70 text-muted">
              <tr>
                <th className="px-5 py-3">Pet</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t border-line">
                  <td className="px-5 py-3">
                    <Link to={`/pets/${request.pet?.id}`} className="font-medium hover:text-brand">{request.pet?.name}</Link>
                  </td>
                  <td className="px-5 py-3 text-muted">{formatDate(request.createdAt)}</td>
                  <td className="px-5 py-3"><StatusBadge value={request.status} /></td>
                  <td className="px-5 py-3">
                    {request.status === 'PENDING' ? (
                      <button type="button" onClick={() => setCancelId(request.id)} className="text-rose-700">
                        Cancel
                      </button>
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
        open={Boolean(cancelId)}
        title="Cancel this request?"
        message="The shelter will no longer see this as a pending application."
        confirmLabel="Cancel request"
        tone="danger"
        loading={working}
        onClose={() => setCancelId(null)}
        onConfirm={confirmCancel}
      />
    </div>
  )
}
