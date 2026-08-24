import { useEffect, useState } from 'react'
import { petApi } from '../api/petApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import PetCard from '../components/pets/PetCard.jsx'
import PetSkeleton from '../components/common/PetSkeleton.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import { AVAILABILITY, GENDERS, HEALTH, SPECIES, pretty } from '../utils/format.js'

const selectClass = 'rounded-2xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand'

export default function Pets() {
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    gender: '',
    location: '',
    healthStatus: '',
    availability: 'AVAILABLE',
  })
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = { page, size: 9 }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value
    })
    petApi
      .list(params)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [filters, page])

  function updateFilter(name, value) {
    setPage(0)
    setFilters((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl">Find a pet</h1>
      <p className="mt-2 text-muted">Search and filter listings from owners and shelters.</p>

      <div className="mt-8 grid gap-3 rounded-3xl border border-line bg-card p-4 md:grid-cols-3 lg:grid-cols-6">
        <input
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search name, breed, city"
          className={`${selectClass} lg:col-span-2`}
        />
        <select value={filters.species} onChange={(e) => updateFilter('species', e.target.value)} className={selectClass}>
          <option value="">All species</option>
          {SPECIES.map((item) => (
            <option key={item} value={item}>{pretty(item)}</option>
          ))}
        </select>
        <select value={filters.gender} onChange={(e) => updateFilter('gender', e.target.value)} className={selectClass}>
          <option value="">All genders</option>
          {GENDERS.map((item) => (
            <option key={item} value={item}>{pretty(item)}</option>
          ))}
        </select>
        <select value={filters.healthStatus} onChange={(e) => updateFilter('healthStatus', e.target.value)} className={selectClass}>
          <option value="">All health</option>
          {HEALTH.map((item) => (
            <option key={item} value={item}>{pretty(item)}</option>
          ))}
        </select>
        <select value={filters.availability} onChange={(e) => updateFilter('availability', e.target.value)} className={selectClass}>
          <option value="">Any status</option>
          {AVAILABILITY.map((item) => (
            <option key={item} value={item}>{pretty(item)}</option>
          ))}
        </select>
        <input
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          placeholder="Location"
          className={selectClass}
        />
      </div>

      <div className="mt-8">
        {loading ? <PetSkeleton /> : null}
        {!loading && error ? <ErrorState message={error} /> : null}
        {!loading && !error && !data?.content?.length ? (
          <EmptyState title="No pets found" message="Try a different search or clear a few filters." />
        ) : null}
        {!loading && !error && data?.content?.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.content.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {data.page + 1} of {Math.max(data.totalPages, 1)}
              </span>
              <button
                type="button"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
