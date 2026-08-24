import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import StatusBadge from '../common/StatusBadge.jsx'
import { PLACEHOLDER_PET, pretty } from '../../utils/format.js'

export default function PetCard({ pet }) {
  const image = pet.primaryImageUrl || pet.imageUrl || PLACEHOLDER_PET
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={pet.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-4 top-4">
          <StatusBadge value={pet.availability} />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-display text-2xl">{pet.name}</h3>
          <p className="text-sm text-muted">
            {pet.breed || pretty(pet.species)} · {pet.age} {pet.age === 1 ? 'year' : 'years'} · {pretty(pet.gender)}
          </p>
        </div>
        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPin size={14} /> {pet.location}
        </p>
        <div className="flex items-center justify-between">
          <StatusBadge value={pet.healthStatus || pet.healthStatus} />
          <Link
            to={`/pets/${pet.id}`}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
