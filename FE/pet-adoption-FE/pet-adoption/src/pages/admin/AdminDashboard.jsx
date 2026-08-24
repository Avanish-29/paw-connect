import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Heart, PawPrint, Users } from 'lucide-react'
import { adminApi } from '../../api/adminApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'
import { formatDate } from '../../utils/format.js'

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [requests, setRequests] = useState([])
  const [pets, setPets] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([adminApi.dashboard(), adminApi.requests(), adminApi.pets({ size: 6, page: 0 })])
      .then(([dash, reqs, petPage]) => {
        setDashboard(dash)
        setRequests(reqs.slice(0, 6))
        setPets(petPage.content || [])
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (!dashboard && !error) return <Spinner />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <h1 className="font-display text-4xl">Admin dashboard</h1>
      <p className="mt-2 text-muted">Monitor users, listings, and adoption activity.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={dashboard.totalUsers} />
        <StatCard icon={Users} label="Total Adopters" value={dashboard.totalAdopters} />
        <StatCard icon={Users} label="Total Owners" value={dashboard.totalOwners} />
        <StatCard icon={PawPrint} label="Total Pets" value={dashboard.totalPets} />
        <StatCard icon={Heart} label="Available Pets" value={dashboard.availablePets} />
        <StatCard icon={Heart} label="Adopted Pets" value={dashboard.adoptedPets} />
        <StatCard icon={ClipboardList} label="Pending Requests" value={dashboard.pendingRequests} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent requests</h2>
            <Link to="/admin/requests" className="text-sm font-semibold text-brand">Manage</Link>
          </div>
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between border-t border-line py-3 text-sm">
              <span>{request.pet?.name} · {request.adopter?.name}</span>
              <StatusBadge value={request.status} />
            </div>
          ))}
        </section>
        <section className="rounded-3xl border border-line bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent pets</h2>
            <Link to="/admin/pets" className="text-sm font-semibold text-brand">Manage</Link>
          </div>
          {pets.map((pet) => (
            <div key={pet.id} className="flex items-center justify-between border-t border-line py-3 text-sm">
              <span>{pet.name} · {formatDate(pet.createdAt)}</span>
              <StatusBadge value={pet.availability} />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
