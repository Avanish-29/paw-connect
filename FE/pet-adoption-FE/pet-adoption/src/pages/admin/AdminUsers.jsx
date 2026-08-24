import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { pretty } from '../../utils/format.js'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    setLoading(true)
    adminApi.users().then(setUsers).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function confirm() {
    setWorking(true)
    try {
      await adminApi.updateUserStatus(target.id, target.next)
      setTarget(null)
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
      <h1 className="font-display text-4xl">Users</h1>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-sand/70 text-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-line">
                <td className="px-5 py-3 font-medium">{user.name}</td>
                <td className="px-5 py-3">{user.email}</td>
                <td className="px-5 py-3">{pretty(user.role)}</td>
                <td className="px-5 py-3"><StatusBadge value={user.status} /></td>
                <td className="px-5 py-3">
                  {user.role === 'ADMIN' ? (
                    <span className="text-muted">Protected</span>
                  ) : (
                    <button
                      type="button"
                      className="text-brand"
                      onClick={() => setTarget({ id: user.id, next: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                    >
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={Boolean(target)}
        title="Change user status?"
        message="Inactive users will not be able to log in."
        confirmLabel="Update status"
        loading={working}
        onClose={() => setTarget(null)}
        onConfirm={confirm}
      />
    </div>
  )
}
