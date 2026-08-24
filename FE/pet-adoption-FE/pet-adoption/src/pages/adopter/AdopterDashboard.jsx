import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, HeartHandshake, XCircle } from 'lucide-react'
import { adoptionApi } from '../../api/adoptionApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'
import { formatDate } from '../../utils/format.js'

export default function AdopterDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adoptionApi.adopterDashboard().then(setData).catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (!data && !error) return <Spinner />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <h1 className="font-display text-4xl">Adopter dashboard</h1>
      <p className="mt-2 text-muted">Track every request you have sent to shelters.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={HeartHandshake} label="Total Requests" value={data.totalRequests} />
        <StatCard icon={Clock} label="Pending" value={data.pending} />
        <StatCard icon={CheckCircle2} label="Approved" value={data.approved} />
        <StatCard icon={XCircle} label="Rejected" value={data.rejected} />
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-card">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-display text-2xl">Recent requests</h2>
          <Link to="/adopter/requests" className="text-sm font-semibold text-brand">View all</Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/70 text-muted">
            <tr>
              <th className="px-5 py-3">Pet</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data.recentRequests || []).slice(0, 8).map((request) => (
              <tr key={request.id} className="border-t border-line">
                <td className="px-5 py-3 font-medium">{request.pet?.name}</td>
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
