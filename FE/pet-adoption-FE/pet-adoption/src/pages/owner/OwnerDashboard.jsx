import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, PawPrint, Plus, ClipboardList } from 'lucide-react'
import { adoptionApi } from '../../api/adoptionApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'
import { formatDate } from '../../utils/format.js'

export default function OwnerDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adoptionApi.ownerDashboard().then(setData).catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (!data && !error) return <Spinner />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Owner dashboard</h1>
          <p className="mt-2 text-muted">Manage listings and review adoption requests.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/owner/pets/create" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
            <span className="inline-flex items-center gap-1"><Plus size={16} /> Add New Pet</span>
          </Link>
          <Link to="/owner/pets" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Manage Pets</Link>
          <Link to="/owner/requests" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">View Requests</Link>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={PawPrint} label="My Pets" value={data.myPets} />
        <StatCard icon={Heart} label="Available Pets" value={data.availablePets} />
        <StatCard icon={Heart} label="Adopted Pets" value={data.adoptedPets} />
        <StatCard icon={ClipboardList} label="Pending Requests" value={data.pendingRequests} />
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-card">
        <h2 className="px-5 py-4 font-display text-2xl">Pets</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/70 text-muted">
            <tr>
              <th className="px-5 py-3">Pet</th>
              <th className="px-5 py-3">Breed</th>
              <th className="px-5 py-3">Age</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Requests</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data.recentPets || []).map((pet) => (
              <tr key={pet.id} className="border-t border-line">
                <td className="px-5 py-3 font-medium">{pet.name}</td>
                <td className="px-5 py-3">{pet.breed || '—'}</td>
                <td className="px-5 py-3">{pet.age}</td>
                <td className="px-5 py-3"><StatusBadge value={pet.availability} /></td>
                <td className="px-5 py-3">{pet.pendingRequestCount}</td>
                <td className="px-5 py-3">
                  <Link to={`/owner/pets/${pet.id}/edit`} className="text-brand">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-sm text-muted">
        Latest request: {(data.recentRequests || [])[0]
          ? `${data.recentRequests[0].pet?.name} · ${formatDate(data.recentRequests[0].createdAt)}`
          : 'None yet'}
      </div>
    </div>
  )
}
