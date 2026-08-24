import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'

export default function AdminPets() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    adminApi.pets({ size: 50, page: 0 }).then(setData).catch((err) => setError(getErrorMessage(err)))
  }

  useEffect(() => { load() }, [])

  async function confirmDelete() {
    setWorking(true)
    try {
      await adminApi.deletePet(deleteId)
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
      <h1 className="font-display text-4xl">Pets</h1>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-sand/70 text-muted">
            <tr>
              <th className="px-5 py-3">Pet</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {(data?.content || []).map((pet) => (
              <tr key={pet.id} className="border-t border-line">
                <td className="px-5 py-3 font-medium">{pet.name}</td>
                <td className="px-5 py-3">{pet.owner?.name}</td>
                <td className="px-5 py-3">{pet.location}</td>
                <td className="px-5 py-3"><StatusBadge value={pet.availability} /></td>
                <td className="px-5 py-3">
                  <button type="button" className="text-rose-700" onClick={() => setDeleteId(pet.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this pet?"
        message="This listing will be removed from the platform."
        confirmLabel="Delete"
        tone="danger"
        loading={working}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
