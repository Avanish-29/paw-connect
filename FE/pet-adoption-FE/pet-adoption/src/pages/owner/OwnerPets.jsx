import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { petApi } from '../../api/petApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'

export default function OwnerPets() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    petApi.ownerList({ size: 50, page: 0 }).then(setData).catch((err) => setError(getErrorMessage(err)))
  }

  useEffect(() => { load() }, [])

  async function confirmDelete() {
    setWorking(true)
    try {
      await petApi.remove(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setWorking(false)
    }
  }

  if (!data && !error) return <Spinner />

  return (
    <div>
      <div className="flex items-end justify-between">
        <h1 className="font-display text-4xl">My pets</h1>
        <Link to="/owner/pets/create" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
          Add New Pet
        </Link>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      {!data?.content?.length ? (
        <div className="mt-6">
          <EmptyState title="No listings yet" message="Create your first pet listing to start receiving requests." />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-card">
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
              {data.content.map((pet) => (
                <tr key={pet.id} className="border-t border-line">
                  <td className="px-5 py-3 font-medium">{pet.name}</td>
                  <td className="px-5 py-3">{pet.breed || '—'}</td>
                  <td className="px-5 py-3">{pet.age}</td>
                  <td className="px-5 py-3"><StatusBadge value={pet.availability} /></td>
                  <td className="px-5 py-3">{pet.pendingRequestCount}</td>
                  <td className="px-5 py-3 space-x-3">
                    <Link to={`/owner/pets/${pet.id}/edit`} className="text-brand">Edit</Link>
                    <button type="button" onClick={() => setDeleteId(pet.id)} className="text-rose-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this listing?"
        message="Related adoption requests will also be removed."
        confirmLabel="Delete"
        tone="danger"
        loading={working}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
