import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import { formatDate } from '../../utils/format.js'

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .requests()
      .then(setRequests)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <h1 className="font-display text-4xl">Adoption requests</h1>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-sand/70 text-muted">
            <tr>
              <th className="px-5 py-3">Pet</th>
              <th className="px-5 py-3">Adopter</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
